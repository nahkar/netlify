import { Outlet } from 'react-router-dom';
import { Header } from '../../components/Header';
import { Box } from '@mui/material';

export const MainLayout = () => {
	return (
		<Box sx={{ pt: '70px', px: '50px' }}>
			<Header />
			<Outlet />
		</Box>
	);
};
