import { getDeepClone } from 'utils';
import { IColumn } from 'interfaces/column.interface';
import { EditMatchT, IMatch } from 'interfaces/match.interface';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { useMutation } from 'react-query';
import { IBracket } from 'interfaces/bracket.interface';
import { useParams } from 'react-router-dom';
import { api } from '~api';

type PropsT = {
	deleteMatch: (matchId: string, isKeepRelation: boolean) => void;
	setMatches: Dispatch<SetStateAction<IMatch[]>>;
	columns: IColumn[];
	matches: IMatch[];
	updateInstance: () => void;
};

type useClipboardResult = {
	selected: IMatch[];
	isShowContextMenu: string;
	editableMatchId: string;
	clickMatchHandler: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, match: IMatch) => void;
	contextMenuHandler: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, match: IMatch) => void;
	cutHandler: () => void;
	pasteHandler: () => void;
	copyHandler: () => void;
	editMatchHandler: (match: EditMatchT & { id: string }) => void;
	selectAllHandler: () => void;
	removeCacheSelected: () => void;
	closeOverlayHandler: () => void;
	toogleEditMatchModal: (matchId: string) => void;
	contextMenuOnEmptyMatchHandler: (props: { e: React.MouseEvent<HTMLDivElement, MouseEvent>; column: IColumn; index: number }) => void;
	emptyContextMenu: { column: IColumn; index: number } | null;
};

export const useClipboard = ({ deleteMatch, setMatches, columns, updateInstance, matches }: PropsT): useClipboardResult => {
	const [selected, setSelected] = useState<IMatch[]>((JSON.parse(localStorage.getItem('selected')!) as IMatch[]) || []);
	const [copies, setCopies] = useState<IMatch[]>((JSON.parse(localStorage.getItem('copies')!) as IMatch[]) || []);

	const [isShowContextMenu, setIsShowContextMenu] = useState('');
	const [emptyContextMenu, setEmptyContextMenu] = useState<{ column: IColumn; index: number } | null>(null);

	const [editableMatchId, setEditableMatchId] = useState('');

	const editBracketMutation = useMutation((data: { id: string; bracket: Partial<IBracket> }) => api.editBracket(data.id, data.bracket));

	const params = useParams();

	useEffect(() => {
		localStorage.setItem('selected', JSON.stringify(selected));
	}, [selected]);

	useEffect(() => {
		localStorage.setItem('copies', JSON.stringify(copies));
	}, [copies]);

	const closeOverlayHandler = () => {
		setIsShowContextMenu('');
		setEmptyContextMenu(null);
	};

	const hasInSelected = (matchId: string) => {
		return selected.some((m) => m.id === matchId);
	};

	const getColumns = () => {
		return columns.filter((c) => !c.isLooserColumn && c.columnIndex !== null);
	};

	const addToClipboard = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, match: IMatch) => {
		if (event.metaKey || (event.ctrlKey && !event.altKey)) {
			if (hasInSelected(match.id)) {
				setSelected((prev) => getDeepClone(prev.filter((m) => m.id !== match.id)));
			} else {
				setSelected((prev) => getDeepClone([...prev, match]));
			}
		} else {
			if (hasInSelected(match.id)) {
				setSelected([]);
			} else {
				setSelected(getDeepClone([match]));
			}
		}
	};

	const clickMatchHandler = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, match: IMatch) => {
		addToClipboard(e, match);
	};

	const contextMenuHandler = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, match: IMatch) => {
		e.preventDefault();
		if (!hasInSelected(match.id)) {
			setSelected((prev) => getDeepClone([...prev, match]));
		}

		setIsShowContextMenu((prev) => (prev ? '' : match.id));
	};

	const contextMenuOnEmptyMatchHandler = ({
		e,
		column,
		index,
	}: {
		e: React.MouseEvent<HTMLDivElement, MouseEvent>;
		column: IColumn;
		index: number;
	}) => {
		e.preventDefault();
		setEmptyContextMenu({ column, index });
	};

	const cutHandler = () => {
		selected.forEach((match) => {
			deleteMatch(match.id, true);
		});
	};

	const copyHandler = () => {
		const copiedMatchees = getDeepClone([...selected]).map((match, index) => {
			let count = matches.length + 1;

			const data = {
				...match,
				id: uuidv4(),
				matchName: (count + index).toString(),
				prevMatchId: null,
				nextMatchId: null,
				participants: match.participants.map((p) => {
					return {
						...p,
						id: uuidv4(),
						name: 'Copy ' + p.name,
					};
				}),
			};
			count++;
			return data;
		});
		setCopies(copiedMatchees);
		setSelected([]);
		setEmptyContextMenu(null);
		setIsShowContextMenu('');
	};

	const selectAllHandler = () => {
		setSelected(getDeepClone([...matches]));
		setIsShowContextMenu('');
	};

	const getMatchWithMinColumnIndexAndMatchNumber = (matches: IMatch[]) => {
		return matches.reduce((minObject, currentObject) => {
			if (
				currentObject.columnIndex < minObject.columnIndex ||
				(currentObject.columnIndex === minObject.columnIndex && currentObject.matchNumber < minObject.matchNumber)
			) {
				return currentObject;
			}
			return minObject;
		}, matches[0]);
	};

	const updateSelectedMatches = () => {
		// const data = selected.length ? selected : copies;
		const data = (
			JSON.parse(localStorage.getItem('selected')!).length
				? JSON.parse(localStorage.getItem('selected')!)
				: JSON.parse(localStorage.getItem('copies')!)
		) as IMatch[];
		if (emptyContextMenu) {
			if (data.length === 1) {
				// * For one match
				return data.map((match) => {
					return {
						...match,
						columnIndex: emptyContextMenu.column.columnIndex ? emptyContextMenu.column.columnIndex : match.columnIndex,
						columnId: emptyContextMenu.column.id,
						matchNumber: emptyContextMenu.index,
					};
				});
			} else {
				// * For multiple matches
				const countOfColumnsForPaste =
					Math.max(...data.map((match) => match.columnIndex)) - Math.min(...data.map((match) => match.columnIndex)) + 1;
				const columnsForPaste = getColumns().filter(
					(c) =>
						c.columnIndex !== null && emptyContextMenu.column.columnIndex !== null && c.columnIndex >= emptyContextMenu.column.columnIndex,
				);
				if (countOfColumnsForPaste > columnsForPaste.length) {
					toast.error('The number of columns is less than the number of matches');
				} else {
					const idsForPaste = columnsForPaste.map((c) => c.id);
					const mapper: Record<string, string> = {};

					[
						...new Set(
							getDeepClone(data)
								.sort((a, b) => a.columnIndex - b.columnIndex)
								.map((m) => m.columnId),
						),
					].forEach((columnId, index) => {
						mapper[columnId] = idsForPaste[index];
					});

					const matchesWithCoulumns = getDeepClone(data)
						.sort((a, b) => a.columnIndex - b.columnIndex)
						.reduce((acc, current) => {
							current.columnId = mapper[current.columnId];
							acc.push(current);
							return acc;
						}, [] as IMatch[]);

					const minMatch = getMatchWithMinColumnIndexAndMatchNumber(matchesWithCoulumns);
					return matchesWithCoulumns.map((m) => {
						if (m.id === minMatch.id) {
							return {
								...m,
								matchNumber: emptyContextMenu.index,
							};
						}
						return {
							...m,
							matchNumber: m.matchNumber - minMatch.matchNumber + emptyContextMenu.index,
						};
					});
				}
			}

			return selected.map((match) => {
				return {
					...match,
				};
			});
		}
		return selected;
	};

	const pasteHandler = () => {
		setMatches((prev) => [...prev, ...updateSelectedMatches()].sort((a, b) => a.columnIndex - b.columnIndex));
		setEmptyContextMenu(null);
		setIsShowContextMenu('');
		setSelected([]);
		setCopies([]);
		updateInstance();
	};
	// TODO: hotkey
	// useEffect(() => {
	// 	const handleCopyOrPaste = (event: KeyboardEvent) => {
	// 		if (event.key === 'c' && (event.metaKey || event.ctrlKey)) {
	// 			console.log('Copy shortcut pressed');
	// 		} else if (event.key === 'v' && (event.metaKey || event.ctrlKey)) {
	// 			pasteHandler();
	// 			console.log('Paste shortcut pressed');
	// 		} else if (event.key === 'x' && (event.metaKey || event.ctrlKey)) {
	// 			cutHandler();
	// 		}
	// 	};

	// 	window.addEventListener('keydown', handleCopyOrPaste);

	// 	return () => {
	// 		window.removeEventListener('keydown', handleCopyOrPaste);
	// 	};
	// }, []);

	const toogleEditMatchModal = (matchId: string) => {
		if (matchId && selected.length === 1 && selected[0].id === matchId) {
			setEditableMatchId(matchId);
		} else {
			setEditableMatchId('');
			setSelected([]);
		}
	};

	const editMatchHandler = (match: EditMatchT & { id: string }) => {
		setMatches((prev) => {
			const updatedMatches = prev.map((m) => {
				if (m.id === match.id) {
					m.matchName = match.matchName;
					m.participants[0].name = match.team1Name;
					m.participants[1].name = match.team2Name;
				}
				return m;
			});
			editBracketMutation.mutate({ id: params.id!, bracket: { matches: updatedMatches } });
			return updatedMatches;
		});
	};

	const removeCacheSelected = () => {
		setSelected([]);
	};
	return {
		selected,
		isShowContextMenu,
		clickMatchHandler,
		contextMenuHandler,
		cutHandler,
		closeOverlayHandler,
		contextMenuOnEmptyMatchHandler,
		emptyContextMenu,
		pasteHandler,
		copyHandler,
		selectAllHandler,
		editableMatchId,
		toogleEditMatchModal,
		editMatchHandler,
		removeCacheSelected,
	};
};
