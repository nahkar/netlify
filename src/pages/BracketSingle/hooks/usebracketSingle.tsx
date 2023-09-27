import { useParams } from 'react-router-dom';
import { IBracket } from '../../../interfaces/bracket.interface';
import { useQuery } from 'react-query';
import { api } from '../../../api';
import { RefObject, useEffect, useState } from 'react';
import { IColumn } from '../../../interfaces/column.interface';
import { IMatch } from '../../../interfaces/match.interface';
import { getDeepClone, getNumbersArray } from '../../../utils';
import { COUNT_EMTY_BLOCKS } from '../../../constants';
import { getMatchById, isFinalMatch } from '../../../services/match.service';
import { Match__ContainerStyled, Match__WrapperStyled } from '../components/Match/styled';
import { DragStart, Draggable } from 'react-beautiful-dnd';
import { Match } from '../components/Match';
import { EmptyMatch__WrapperStyled } from '../components/EmptyMatch/styled';
import { EmptyMatch } from '../components/EmptyMatch';
import { jsPlumbInstance } from 'jsplumb';
import {
	addPrefixToMatchId,
	deleteConnectionsAndEndpoints,
	getInstance,
	setConnection,
	setListeners,
	setPrevAndNextMatchConnections,
} from '../../../services/plumb';

type PropsT = {
	container: RefObject<HTMLDivElement>;
};

type useSingleResult = {
	isLoading: boolean;
	columns: IColumn[];
	matches: IMatch[];
	renderMatch: (data: RenderMatchT) => JSX.Element[];
	onDragStart: (start: DragStart) => void;
};
type RenderMatchT = { matches: IMatch[]; column: IColumn };

export const useBracketSingle = ({ container }: PropsT): useSingleResult => {
	const [_, setSingleBracket] = useState<IBracket | null>(null);
	const [columns, setColumns] = useState<IColumn[]>([]);
	const [matches, setMatches] = useState<IMatch[]>([]);
	const [isDraging, setIsDraging] = useState(false);
	const [instance, setInstance] = useState<jsPlumbInstance | null>(null);

	const useFetchBracket = (id: string) =>
		useQuery(['bracket', id], () => api.fetchBracket(id), {
			onSuccess: (data) => {
				setSingleBracket(data);
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
										// className={`match-styled match-styled__${match.id}`}
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

	return {
		isLoading,
		columns,
		matches,
		renderMatch,
		onDragStart,
	};
};
