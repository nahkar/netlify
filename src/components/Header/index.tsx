import {
	AppBar,
	Box,
	Drawer,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Toolbar,
	Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ViewListIcon from '@mui/icons-material/ViewList';
import { useHeader } from './hooks/useHeader';
import { Header__LinkMenuStyled, Header__LinkStyled } from './styled';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
export const Header = () => {
	const { isOpen, onOpen, onClose } = useHeader();
	return (
		<AppBar position="fixed" data-testid="header">
			<Toolbar>
				<IconButton size="large" edge="start" color="inherit" sx={{ mr: 2 }} onClick={onOpen} data-testid="user-menu">
					<MenuIcon />
				</IconButton>
				<Drawer open={isOpen} onClose={onClose}>
					<Box sx={{ width: 250 }} onClick={onClose} onKeyDown={onClose} data-testid="user-menu-list">
						<List>
							<ListItem disablePadding sx={{ display: 'block' }}>
								<Header__LinkMenuStyled to="create-bracket">
									<ListItemButton>
										<ListItemIcon>
											<CreateNewFolderIcon color="info" />
										</ListItemIcon>
										<ListItemText primary="Create Bracket" />
									</ListItemButton>
								</Header__LinkMenuStyled>
							</ListItem>
							<ListItem disablePadding sx={{ display: 'block' }}>
								<Header__LinkMenuStyled to="brackets">
									<ListItemButton>
										<ListItemIcon>
											<ViewListIcon color="info" />
										</ListItemIcon>
										<ListItemText primary="My Brackets" />
									</ListItemButton>
								</Header__LinkMenuStyled>
							</ListItem>
						</List>
					</Box>
				</Drawer>
				<Typography variant="h6" component="div" sx={{ flexGrow: 1 }} align="center">
					<Header__LinkStyled to="/">Bracket22 Builder</Header__LinkStyled>
				</Typography>
			</Toolbar>
		</AppBar>
	);
};
