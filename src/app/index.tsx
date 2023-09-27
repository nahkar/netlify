import { Route, Routes } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { Home } from '../pages/Home';
import { BracketList } from '../pages/BracketList';
import { BracketSingle } from '../pages/BracketSingle';
import { CreateBracket } from '../pages/CreateBracket';

export const App = () => (
	<Routes>
		<Route path='/' element={<MainLayout />}>
			<Route index element={<Home />} />
			<Route path='brackets/:id' element={<BracketSingle />} />
			<Route path='brackets' element={<BracketList />} />
			<Route path='create-bracket' element={<CreateBracket />} />
		</Route>
	</Routes>
);
