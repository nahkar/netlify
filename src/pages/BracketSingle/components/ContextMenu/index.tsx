import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import ContentCut from '@mui/icons-material/ContentCut';
import ContentCopy from '@mui/icons-material/ContentCopy';
import ContentPaste from '@mui/icons-material/ContentPaste';
import ListIcon from '@mui/icons-material/List';
import DeleteIcon from '@mui/icons-material/Delete';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import EditIcon from '@mui/icons-material/Edit';
import styled from './styled';
import { IMatch } from 'interfaces/match.interface';
const { OverflayStyled } = styled;

type PropsT = {
	removeCacheSelected: () => void;
	selected: IMatch[];
	deleteMatchHandler: (matchId: string, isKeepRelation?: boolean) => void;
	matchId?: string;
	closeOverlayHandler: () => void;
	countOfSelectedMatches: number;
	onCutHandler: () => void;
	onCopyHandler: () => void;
	pasteHandler?: () => void;
	isEmptyContextMenu: boolean;
	selectAllHandler: () => void;
	toogleEditMatchModal: (matchId: string) => void;
};

export const ContextMenu = ({
	closeOverlayHandler,
	countOfSelectedMatches,
	onCutHandler,
	isEmptyContextMenu,
	pasteHandler,
	onCopyHandler,
	selectAllHandler,
	toogleEditMatchModal,
	matchId,
	deleteMatchHandler,
	selected,
	removeCacheSelected
}: PropsT) => {
	const onPaste = () => {
		if (pasteHandler) {
			pasteHandler();
		}
	};
	return (
		<>
			<OverflayStyled onClick={closeOverlayHandler} onContextMenu={closeOverlayHandler} />
			<Paper sx={{ width: 320, maxWidth: '100%', zIndex: 1001, position: 'absolute' }}>
				<MenuList>
					{!isEmptyContextMenu && (
						<MenuItem
							onClick={(e) => {
								e.stopPropagation();
								onCutHandler();
							}}
						>
							<ListItemIcon>
								<ContentCut fontSize='small' />
							</ListItemIcon>
							<ListItemText>Cut</ListItemText>
							<Typography variant='body2' color='text.secondary'>
								⌘X
							</Typography>
						</MenuItem>
					)}
					{!isEmptyContextMenu && (
						<MenuItem
							onClick={(e) => {
								e.stopPropagation();
								onCopyHandler();
							}}
						>
							<ListItemIcon>
								<ContentCopy fontSize='small' />
							</ListItemIcon>
							<ListItemText>Copy (Duplicate)</ListItemText>
							<Typography variant='body2' color='text.secondary'>
								⌘C
							</Typography>
						</MenuItem>
					)}
					<MenuItem
						onClick={(e) => {
							e.stopPropagation();
							selectAllHandler();
						}}
					>
						<ListItemIcon>
							<DoneAllIcon fontSize='small' />
						</ListItemIcon>
						<ListItemText>Select All</ListItemText>
						<Typography variant='body2' color='text.secondary'>
							⌘A
						</Typography>
					</MenuItem>
					{/* //* Don't show edit for empty matches and if selected less or more than one match  */}
					{!isEmptyContextMenu && matchId && (
						<MenuItem
							disabled={countOfSelectedMatches > 1 || countOfSelectedMatches < 1}
							onClick={(e) => {
								e.stopPropagation();
								toogleEditMatchModal(matchId);
								closeOverlayHandler();
							}}
						>
							<ListItemIcon>
								<EditIcon fontSize='small' />
							</ListItemIcon>
							<ListItemText>Edit</ListItemText>
							<Typography variant='body2' color='text.secondary'>
								⌘E
							</Typography>
						</MenuItem>
					)}
					{!isEmptyContextMenu && (
						<MenuItem
							onClick={(e) => {
								e.stopPropagation();
								selected.forEach((match) => {
									deleteMatchHandler(match.id);
								});
								removeCacheSelected();
							}}
						>
							<ListItemIcon>
								<DeleteIcon fontSize='small' />
							</ListItemIcon>
							<ListItemText>Delete</ListItemText>
							<Typography variant='body2' color='text.secondary'>
								⌘D
							</Typography>
						</MenuItem>
					)}
					{isEmptyContextMenu && (
						<MenuItem
							onClick={(e) => {
								e.stopPropagation();
								onPaste();
							}}
						>
							<ListItemIcon>
								<ContentPaste fontSize='small' />
							</ListItemIcon>
							<ListItemText>Paste</ListItemText>
							<Typography variant='body2' color='text.secondary'>
								⌘V
							</Typography>
						</MenuItem>
					)}
					{!isEmptyContextMenu && (
						<div>
							<Divider />
							<MenuItem disabled>
								<ListItemIcon>
									<ListIcon fontSize='small' />
								</ListItemIcon>
								<ListItemText>
									{countOfSelectedMatches} {countOfSelectedMatches === 1 ? 'match' : 'matches'}
								</ListItemText>
							</MenuItem>
						</div>
					)}
				</MenuList>
			</Paper>
		</>
	);
};
