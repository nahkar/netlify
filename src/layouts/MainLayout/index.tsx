import { Outlet } from 'react-router-dom';
import { Header } from '../../components/Header';

export const MainLayout = () => {
	return (
		<main style={{ paddingTop: '70px' }}>
			<Header />
			<Outlet />
		</main>
	);
};
