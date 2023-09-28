import { useParams } from 'react-router-dom';
import { IBracket } from '../../../interfaces/bracket.interface';
import { useQuery } from 'react-query';
import { api } from '../../../api';
import { RefObject, useCallback, useEffect, useState } from 'react';
import { IColumn } from '../../../interfaces/column.interface';
import { IMatch } from '../../../interfaces/match.interface';
import { getDeepClone, getNumbersArray } from '../../../utils';
import { COUNT_EMTY_BLOCKS } from '../../../constants';
import { getMatchById, isFinalMatch } from '../../../services/match.service';
import { Match__ContainerStyled, Match__WrapperStyled } from '../components/Match/styled';
import { DragStart, Draggable, DropResult } from 'react-beautiful-dnd';
import { Match } from '../components/Match';
import { EmptyMatch__WrapperStyled } from '../components/EmptyMatch/styled';
import { EmptyMatch } from '../components/EmptyMatch';
import { jsPlumbInstance } from 'jsplumb';
import {
	addPrefixToMatchId,
	deleteConnectionsAndEndpoints,
	getInstance,
	setConnection,
	setEndpoint,
	setListeners,
	setPrevAndNextMatchConnections,
} from '../../../services/plumb';
import { toast } from 'react-toastify';

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
};
type RenderMatchT = { matches: IMatch[]; column: IColumn };

export const useBracketSingle = ({ container, createMatchOpenModal }: PropsT): useSingleResult => {
	const [_, setSingleBracket] = useState<IBracket | null>(null);
	const [columns, setColumns] = useState<IColumn[]>([]);
	const [matches, setMatches] = useState<IMatch[]>([]);
	const [isDraging, setIsDraging] = useState(false);
	const [instance, setInstance] = useState<jsPlumbInstance | null>(null);
	const [bracketName, setBracketName] = useState('');

	const changeBracketName = useCallback(
		(name: string) => {
			setBracketName(name);
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

	const params = useParams();

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

			return matches;
		});

		removeRelationModel({ matchId: draggableId, isSameColumn });
		setIsRepaintConnections(true);
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
											// selected={selected}
											// clickMatchHandler={clickMatchHandler}
											// contextMenuHandler={contextMenuHandler}
											// cutHandler={cutHandler}
											// copyHandler={copyHandler}
											// isShowContextMenu={isShowContextMenu}
											// closeOverlayHandler={closeOverlayHandler}
											// highlitedTeamId={highlitedTeamId}
											// handleMouseEnter={handleMouseEnter}
											// handleMouseLeave={handleMouseLeave}
											isLastColumn={isFinalMatch({ match, columns })}
											// column={column}
											match={match}
											// matches={matches}
											// matchEdithandler={matchEdithandler}
											instance={instance}
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
							>
								<EmptyMatch
									// onClick={() => createMatchHandler(column, index)}
									isDraging={isDraging}

									// onContextMenu={(e) => contextMenuOnEmptyMatchHandler({ e, column, index })}
								/>
							</EmptyMatch__WrapperStyled>
							{/* {emptyContextMenu && emptyContextMenu.column.id === column.id && emptyContextMenu.index === index && (
								<ContextMenu
									onCopyHandler={copyHandler}
									countOfSelectedMatches={selected.length}
									closeOverlayHandler={closeOverlayHandler}
									onCutHandler={cutHandler}
									isEmptyContextMenu={true}
									pasteHandler={pasteHandler}
								/>
							)} */}
						</>
					)}
				</Draggable>
			);
		});
	};

	const addMatch = (match: IMatch) => {
		setMatches((prevMatches) => [...prevMatches, match]);
	};

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
		changeBracketName
	};
};
