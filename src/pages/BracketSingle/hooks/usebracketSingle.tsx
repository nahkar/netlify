import { useParams } from 'react-router-dom';
import { IBracket } from 'interfaces/bracket.interface';
import { useMutation, useQuery } from 'react-query';
import { api } from 'api';
import { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { IColumn } from 'interfaces/column.interface';
import { IMatch } from 'interfaces/match.interface';
import { getDeepClone, getNumbersArray, usePrevious } from 'utils';
import { COUNT_EMTY_BLOCKS } from 'config';
import { getMatchById, isFinalMatch } from '../../../services/match.service';
import { Match__ContainerStyled, Match__WrapperStyled } from '../components/Match/styled';
import { DragStart, Draggable, DropResult } from 'dnd';
import { Match } from '../components/Match';
import { EmptyMatch__WrapperStyled } from '../components/EmptyMatch/styled';
import { EmptyMatch } from '../components/EmptyMatch';
import { jsPlumbInstance } from 'jsplumb';
import { v4 as uuidv4 } from 'uuid';
import { difference, differenceBy, differenceWith, isEqual } from 'lodash';
import {
	addDynamicConnectorStyles,
	addPrefixToMatchId,
	deleteConnectionsAndEndpoints,
	deleteManagedElement,
	getInstance,
	removeDynamicConnectorStyles,
	setConnection,
	setEndpoint,
	setListeners,
	setPrevAndNextMatchConnections,
} from '../../../services/plumb';
import { toast } from 'react-toastify';
import { renameColumn } from '../../../services/column.service';
import { useClipboard } from './useClipboard';
import { ContextMenu } from '../components/ContextMenu';
import { EditMatch } from '../components/EditMatch';
type PropsT = {
	container: RefObject<HTMLDivElement>;
	createMatchOpenModal: ({ column, matchNumber }: { column: IColumn; matchNumber: number }) => void;
};

type useSingleResult = {
	isLoading: boolean;
	columns: IColumn[];
	matches: IMatch[];
	bracketName: string;
	instance: jsPlumbInstance | null;
	renderMatch: (data: RenderMatchT) => JSX.Element[];
	onDragStart: (start: DragStart) => void;
	onDragEnd: (result: DropResult) => void;
	addMatch: (match: IMatch) => void;
	changeBracketName: (name: string) => void;
	addColumn: (name: string) => void;
	editColumn: (data: { name: string; id: string }) => void;
	removeColumn: (id: string) => void;
};
type RenderMatchT = { matches: IMatch[]; column: IColumn };

export const useBracketSingle = ({ container, createMatchOpenModal }: PropsT): useSingleResult => {
	const [_, setSingleBracket] = useState<IBracket | null>(null);
	const [columns, setColumns] = useState<IColumn[]>([]);
	const [matches, setMatches] = useState<IMatch[]>([]);
	const [isDraging, setIsDraging] = useState(false);
	const [instance, setInstance] = useState<jsPlumbInstance | null>(null);
	const [bracketName, setBracketName] = useState('');
	const [highlitedTeamId, setHighlitedTeamId] = useState<string[]>([]);
	const [intervals, setIntervals] = useState<NodeJS.Timeout[]>([]);

	const params = useParams();

	const editBracketMutation = useMutation((data: { id: string; bracket: Partial<IBracket> }) =>
		api.editBracket(data.id, data.bracket)
	);


	const previousMatches = usePrevious<IMatch[]>(matches);

	useEffect(() => {
		const diff = differenceWith(
			matches,
			previousMatches,
			(obj1, obj2) => obj1.nextMatchId === obj2.nextMatchId && isEqual(obj1.prevMatchId, obj2.prevMatchId)
		);
		if (diff.length && diff.length > 0 && diff.length < 3) {
			editBracketMutation.mutate({ id: params.id!, bracket: { matches } });
		}
	}, [matches]);

	const changeBracketName = useCallback(
		(name: string) => {
			setBracketName(name);
			console.log(name);

			editBracketMutation.mutate({ id: params.id!, bracket: { name } });
		},
		[setBracketName]
	);

	const useFetchBracket = (id: string) =>
		useQuery(['bracket', id], () => api.fetchBracket(id), {
			onSuccess: (data) => {
				setSingleBracket(data);
				setBracketName(data.name);
				setColumns(getDeepClone(data.columns));
				setMatches(getDeepClone(data.matches));
			},
		});

	const { isLoading } = useFetchBracket(params.id || '');

	useEffect(() => {
		if (container.current && !instance) {
			setInstance(getInstance({ container: container.current }));
		}
	}, [container, instance, matches.length]);

	useEffect(() => {
		const handleResize = () => {
			if (instance) {
				instance.repaintEverything();
			}
		};

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [instance]);

	useEffect(() => {
		// * When we remove column, we need to repaint connections
		instance?.repaintEverything();
	}, [columns.length]);

	const updateInstance = () => {
		instance?.reset();
		setInstance(getInstance({ container: container.current! }));
	};

	useEffect(() => {
		if (instance) {
			setListeners({ instance, matches, setMatches });
		}
	}, [instance, matches.length]);

	useEffect(() => {
		if (instance && matches.length) {
			// * Add connection after render
			matches.forEach((match) => {
				if (match.nextMatchId) {
					setConnection({
						instance,
						sourceMatchIdWithoutPrefix: match.id,
						targetMatchIdWithoutPrefix: match.nextMatchId,
					});
				}
			});
		}
	}, [instance, matches.length]);

	const [draggableMatch, setDraggableMatch] = useState<IMatch | null>(null);
	const [isRepaintConnections, setIsRepaintConnections] = useState(false);

	useEffect(() => {
		if (isRepaintConnections && instance) {
			setPrevAndNextMatchConnections({
				instance,
				matches,
				draggableMatch,
			});
		}
	}, [isRepaintConnections]);

	const onDragStart = (start: DragStart) => {
		setIsDraging(true);
		if (instance) {
			setIsRepaintConnections(false);
			setDraggableMatch(getDeepClone(getMatchById(matches, start.draggableId)));
			deleteConnectionsAndEndpoints({ matchIdWithPrefix: addPrefixToMatchId(start.draggableId), instance });
		}
	};

	const isMatchPositionTaken = (columnId: string, matchNumber: number, matches: IMatch[]): boolean => {
		const match = matches.find((match) => match.columnId === columnId && match.matchNumber === matchNumber);
		return !!match;
	};

	const removeRelationModel = ({ matchId, isSameColumn }: { matchId: string; isSameColumn?: boolean }) => {
		if (isSameColumn) {
			return;
		}
		setMatches((prev) => {
			return getDeepClone(prev).map((match) => {
				if (match.id === matchId) {
					// * For drag Element
					return {
						...match,
						nextMatchId: null,
						prevMatchId: null,
					};
				}
				// * For next matches
				if (match.prevMatchId && match.prevMatchId.includes(matchId)) {
					return {
						...match,
						prevMatchId: match.prevMatchId.filter((id) => id !== matchId),
					};
				}
				// * For previous matches
				if (match.nextMatchId === matchId) {
					return {
						...match,
						nextMatchId: null,
					};
				}
				return match;
			});
		});
	};

	const onDragEnd = (result: DropResult) => {
		setIsDraging(false);
		if (!instance) {
			return;
		}
		const { source, destination, draggableId } = result;
		const prevMatch = { ...matches.find((match) => match.id === draggableId) } as IMatch;

		const setEndpointParams = {
			instance,
			matchIdWithPrefix: addPrefixToMatchId(prevMatch.id),
			isLastColumn: prevMatch.columnIndex === columns.length - 1,
			match: prevMatch,
		};

		const isSameColumn = draggableMatch?.columnId === result.destination?.droppableId;

		if (!destination) {
			//* Drag out content
			setEndpoint(setEndpointParams);
			removeRelationModel({ matchId: draggableId, isSameColumn: true });

			setPrevAndNextMatchConnections({
				instance,
				matches,
				draggableMatch,
			});

			return;
		}

		if (destination.droppableId === source.droppableId && destination.index === source.index) {
			//* Drag on the same place
			setEndpoint(setEndpointParams);
			removeRelationModel({ matchId: draggableId, isSameColumn: true });

			setPrevAndNextMatchConnections({
				instance,
				matches,
				draggableMatch,
			});

			return;
		}

		const destinationIndex = destination.index;
		const destinationColumnId = destination.droppableId;

		setMatches((prevMatches) => {
			const matches = getDeepClone(prevMatches);
			const currentMatch: IMatch | undefined = matches.find((m) => m.id === draggableId);
			const destinationColumn = columns.find((column) => column.id === destinationColumnId);

			if (currentMatch && destinationColumn) {
				if (isMatchPositionTaken(destinationColumn.id, destinationIndex, matches)) {
					toast.warning('Position is taken');
					return matches;
				}

				if (instance && currentMatch.columnId !== destinationColumn.id) {
					updateInstance();
					// updateManagedElementOnNextTick({ matchIdWithPrefix: addPrefixToMatchId(currentMatch.id), instance });
				}

				currentMatch.matchNumber = destinationIndex;
				currentMatch.columnId = destinationColumn.id;

				currentMatch.matchNumber = destinationIndex;

				const destColumn = columns.find((e) => e.id === destination.droppableId);
				if (destColumn && destColumn.columnIndex !== null) {
					currentMatch.columnIndex = destColumn.columnIndex;
				}
			}
			editBracketMutation.mutate({ id: params.id!, bracket: { matches } });
			return matches;
		});

		removeRelationModel({ matchId: draggableId, isSameColumn });
		setIsRepaintConnections(true);
	};

	const removePlumbOfMatch = ({
		instance,
		matchIdWithoutPrefix,
	}: {
		instance: jsPlumbInstance | null;
		matchIdWithoutPrefix: string;
	}) => {
		if (instance) {
			deleteConnectionsAndEndpoints({ matchIdWithPrefix: addPrefixToMatchId(matchIdWithoutPrefix), instance });
			deleteManagedElement({ matchIdWithPrefix: addPrefixToMatchId(matchIdWithoutPrefix), instance });
		}
	};

	const deleteMatch = useCallback(
		(matchId: string, isKeepRelation?: boolean) => {
			setMatches((m) => {
				const matches = m.filter((m) => m.id !== matchId);
				editBracketMutation.mutate({ id: params.id!, bracket: { matches } });
				return matches;
			});
			if (!isKeepRelation) {
				removeRelationModel({ matchId });
			}
			removePlumbOfMatch({ instance, matchIdWithoutPrefix: matchId });
		},
		[instance]
	);

	const {
		selected,
		clickMatchHandler,
		contextMenuHandler,
		cutHandler,
		copyHandler,
		selectAllHandler,
		isShowContextMenu,
		closeOverlayHandler,
		contextMenuOnEmptyMatchHandler,
		emptyContextMenu,
		pasteHandler,
		editableMatchId,
		toogleEditMatchModal,
		editMatchHandler,
		removeCacheSelected,
	} = useClipboard({
		deleteMatch,
		setMatches,
		columns,
		updateInstance,
		matches,
	});

	const getMatchNameFromTeamId = ({ teamId, matches }: { teamId: string; matches: IMatch[] }) => {
		const match = matches.find(
			(match) => match.participants[0].id.toString() === teamId || match.participants[1].id.toString() === teamId
		);

		return match?.matchName;
	};

	const handleMouseEnter = ({ match, participantIndex }: { match: IMatch; participantIndex: number }) => {
		// * Rule: all matches has to be sorted by columnIndex
		const highligtedTeamId = match.participants[participantIndex].id.toString();

		const currentMatchId = match.id;

		const currentMatchIndex = matches.findIndex((match) => match.id === currentMatchId);

		const prevIndex = currentMatchIndex - 1;
		const nextIndex = currentMatchIndex + 1;

		const prevMatches = prevIndex >= 0 ? matches.slice(0, prevIndex + 1) : [];
		const nextMatches = nextIndex < matches.length ? matches.slice(nextIndex) : [];

		let matchName = getMatchNameFromTeamId({ teamId: highligtedTeamId, matches });

		const nextActiveMatches = nextMatches.reduce(
			(acc: { activeMatchId: string; ids: string[] }, match: IMatch) => {
				if (match.prevMatchId?.includes(acc.activeMatchId)) {
					acc.activeMatchId = match.id;
					if (matchName && match.participants[0].name.includes(matchName)) {
						matchName = getMatchNameFromTeamId({ teamId: match.participants[0].id.toString(), matches });
						acc.ids.push(match.participants[0].id.toString());
					}
					if (matchName && match.participants[1].name.includes(matchName)) {
						matchName = getMatchNameFromTeamId({ teamId: match.participants[0].id.toString(), matches });
						acc.ids.push(match.participants[1].id.toString());
					}
				}
				return acc;
			},
			{ activeMatchId: currentMatchId, ids: [] }
		);

		const highligtedTeamName = match.participants[participantIndex].name;
		const hifgligtedWinnerMatchName: string | undefined = highligtedTeamName.split('M')[1];

		const prevActiveMatches = prevMatches.reverse().reduce(
			(acc: { activeMatchId: string; ids: string[] }, match: IMatch) => {
				if (match.nextMatchId === acc.activeMatchId && match.matchName === hifgligtedWinnerMatchName) {
					acc.activeMatchId = match.id;
					acc.ids.push(match.participants[0].id.toString(), match.participants[1].id.toString());
				}
				return acc;
			},
			{ activeMatchId: currentMatchId, ids: [] }
		);

		setHighlitedTeamId([highligtedTeamId, ...nextActiveMatches.ids, ...prevActiveMatches.ids]);
	};

	useEffect(() => {
		let clear;
		clearInterval(clear);
		const matchesIds = new Set<string>();
		highlitedTeamId.forEach((id) => {
			matches.find((match) => {
				if (match.participants[0].id.toString() === id || match.participants[1].id.toString() === id) {
					matchesIds.add(match.id);
				}
			});
		});
		if (intervals.length) {
			intervals.forEach((interval) => {
				clearInterval(interval);
			});
			setIntervals([]);
		}

		removeDynamicConnectorStyles();
		intervals.forEach((interval) => {
			clearInterval(interval);
		});
		setIntervals([]);

		if (highlitedTeamId.length) {
			addDynamicConnectorStyles(matchesIds, setIntervals);
		}
	}, [highlitedTeamId]);

	const handleMouseLeave = () => {
		setHighlitedTeamId([]);
	};

	const renderMatch = ({ matches, column }: RenderMatchT) => {
		return getNumbersArray(COUNT_EMTY_BLOCKS).map((index) => {
			const match = matches.find((match) => match.columnId === column.id && match.matchNumber === index);
			if (match) {
				isFinalMatch({ match, columns });
				return (
					<Match__WrapperStyled key={match.id}>
						<Draggable draggableId={match.id} index={match.matchNumber}>
							{(provided, snapshot) => {
								return (
									<Match__ContainerStyled
										$isAnotherMatch={!snapshot.isDragging}
										{...provided.draggableProps}
										{...provided.dragHandleProps}
										ref={provided.innerRef}
									>
										<Match
											isSelected={selected.map((m) => m.id).includes(match.id)}
											clickMatchHandler={clickMatchHandler}
											contextMenuHandler={contextMenuHandler}
											highlitedTeamId={highlitedTeamId}
											handleMouseEnter={handleMouseEnter}
											handleMouseLeave={handleMouseLeave}
											isLastColumn={isFinalMatch({ match, columns })}
											match={match}
											instance={instance}
										/>
										{isShowContextMenu === match.id && (
											<ContextMenu
												removeCacheSelected={removeCacheSelected}
												selected={selected}
												deleteMatchHandler={deleteMatch}
												matchId={match.id}
												toogleEditMatchModal={toogleEditMatchModal}
												isEmptyContextMenu={false}
												countOfSelectedMatches={selected.length}
												closeOverlayHandler={closeOverlayHandler}
												onCutHandler={cutHandler}
												onCopyHandler={copyHandler}
												selectAllHandler={selectAllHandler}
											/>
										)}
										<EditMatch
											toogleEditMatchModal={toogleEditMatchModal}
											editableMatchId={editableMatchId}
											match={match}
											editMatchHandler={editMatchHandler}
										/>
									</Match__ContainerStyled>
								);
							}}
						</Draggable>
					</Match__WrapperStyled>
				);
			}

			return (
				<Draggable
					draggableId={`index__${index}__col__${column.id}`}
					index={index}
					key={`index__${index}__col__${column.id}`}
					isDragDisabled
				>
					{(provided) => (
						<>
							<EmptyMatch__WrapperStyled
								{...provided.draggableProps}
								{...provided.dragHandleProps}
								ref={provided.innerRef}
								onClick={() => createMatchOpenModal({ column, matchNumber: index })}
								onContextMenu={(e) => contextMenuOnEmptyMatchHandler({ e, column, index })}
							>
								<EmptyMatch isDraging={isDraging} />
							</EmptyMatch__WrapperStyled>
							{emptyContextMenu && emptyContextMenu.column.id === column.id && emptyContextMenu.index === index && (
								<ContextMenu
									removeCacheSelected={removeCacheSelected}
									selected={selected}
									deleteMatchHandler={deleteMatch}
									toogleEditMatchModal={toogleEditMatchModal}
									onCopyHandler={copyHandler}
									selectAllHandler={selectAllHandler}
									countOfSelectedMatches={selected.length}
									closeOverlayHandler={closeOverlayHandler}
									onCutHandler={cutHandler}
									isEmptyContextMenu={true}
									pasteHandler={pasteHandler}
								/>
							)}
						</>
					)}
				</Draggable>
			);
		});
	};

	const addMatch = (match: IMatch) => {
		setMatches((prevMatches) => {
			editBracketMutation.mutate({
				id: params.id!,
				bracket: {
					matches: [...prevMatches, match],
				},
			});

			return [...prevMatches, match];
		});
	};

	const addColumn = useCallback(
		(name: string) => {
			setColumns((prev) => {
				const columns = prev.map((column) => ({ ...column }));
				columns.push({ id: uuidv4(), name, columnIndex: columns.length });
				editBracketMutation.mutate({
					id: params.id!,
					bracket: {
						columns,
					},
				});
				return columns;
			});
		},
		[setColumns]
	);

	const editColumn = useCallback(
		({ name, id }: { name: string; id: string }) => {
			setColumns((prev) => {
				const columns = renameColumn({ prev, editColumnId: id, columnName: name });
				editBracketMutation.mutate({
					id: params.id!,
					bracket: {
						columns,
					},
				});
				return columns;
			});
		},
		[setColumns]
	);

	const removeColumn = useCallback(
		(id: string) => {
			const column = columns.find((column) => column.id === id);
			if (column) {
				let removedMatches: IMatch[] = [];
				// * Reindex the columnIndex in matches

				setMatches((prev) => {
					const matches = getDeepClone(prev);
					removedMatches = matches.filter((m) => m.columnId === column.id);
					const updatedMatches = matches
						.filter((m) => m.columnId !== column.id)
						.map((m) => {
							if (column.columnIndex !== null && m.columnIndex >= column.columnIndex) {
								return {
									...m,
									columnIndex: m.columnIndex - 1,
								};
							}
							return m;
						});
					editBracketMutation.mutate({
						id: params.id!,
						bracket: {
							matches: updatedMatches,
						},
					});
					return updatedMatches;
				});

				removedMatches.forEach((match) => removeRelationModel({ matchId: match.id }));

				setColumns((prev) => {
					const columns = getDeepClone(prev);
					// * Reindex columnIndex
					const updatedColumns = columns
						.filter((c) => c.id !== column.id)
						.map((column, index) => ({ ...column, columnIndex: index }));
					editBracketMutation.mutate({
						id: params.id!,
						bracket: {
							columns: updatedColumns,
						},
					});
					return updatedColumns;
				});

				matches
					.filter((match) => match.columnId === column.id)
					.forEach((match) => {
						removePlumbOfMatch({ instance, matchIdWithoutPrefix: match.id });
					});
			}
		},
		[columns, matches]
	);

	return {
		isLoading,
		columns,
		matches,
		renderMatch,
		onDragStart,
		onDragEnd,
		addMatch,
		instance,
		bracketName,
		changeBracketName,
		addColumn,
		editColumn,
		removeColumn,
	};
};
