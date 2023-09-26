import { useBracketList } from './hooks/useBracketList';

export const BracketList = () => {
	const { brackets, openBracketHandler, isLoading, deleteBracketHandler } = useBracketList();
	if (isLoading) return <div>Loading...</div>;
	return (
		<>
			<div>BracketList</div>
			<ul>
				{brackets.map((bracket) => (
					<li key={bracket.id}>
						<span>{bracket.name}</span>
						<button onClick={() => openBracketHandler(bracket.id)}>Open</button>
						<button onClick={() => deleteBracketHandler(bracket.id)}>Remove</button>
					</li>
				))}
			</ul>
		</>
	);
};
