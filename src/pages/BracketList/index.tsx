import { useBracketList } from './hooks/useBracketList';

export const BracketList = () => {
	const { brackets } = useBracketList();
	return (
		<>
			<div>BracketList</div>
			<ul>
				{brackets.map((bracket) => (
					<li key={bracket.id}>{bracket.name}</li>
				))}
			</ul>
		</>
	);
};
