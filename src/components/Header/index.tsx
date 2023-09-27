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
import { Link } from 'react-router-dom';
import ViewListIcon from '@mui/icons-material/ViewList';
import { useHeader } from './hooks/useHeader';

export const Header = () => {
	const { isOpen, onOpen, onClose } = useHeader();
	return (
		<AppBar position='fixed'>
			<Toolbar>
				<IconButton size='large' edge='start' color='inherit' sx={{ mr: 2 }} onClick={onOpen} data-testid='user-menu'>
					<MenuIcon />
				</IconButton>
				<Drawer open={isOpen} onClose={onClose}>
					<Box sx={{ width: 250 }} onClick={onClose} onKeyDown={onClose} data-testid='user-menu-list'>
						<List>
						<ListItem disablePadding>
								<Link to='create-bracket'>
									<ListItemButton>
										<ListItemIcon>
											<ViewListIcon color='info' />
										</ListItemIcon>
										<ListItemText primary='Create Bracket' />
									</ListItemButton>
								</Link>
							</ListItem>
							<ListItem disablePadding>
								<Link to='brackets'>
									<ListItemButton>
										<ListItemIcon>
											<ViewListIcon color='info' />
										</ListItemIcon>
										<ListItemText primary='My Brackets' />
									</ListItemButton>
								</Link>
							</ListItem>
						</List>
					</Box>
				</Drawer>
				<Typography variant='h6' component='div' sx={{ flexGrow: 1 }} align='center'>
					<Link to='/'>Bracket Builder</Link>
				</Typography>
			</Toolbar>
		</AppBar>
	);
};
