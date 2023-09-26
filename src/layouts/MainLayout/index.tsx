import { Outlet } from 'react-router-dom';

export const MainLayout = () => {
	return (
		<main>
			<header>Header</header>
			<Outlet />
			<footer>Footer</footer>
		</main>
	);
};
