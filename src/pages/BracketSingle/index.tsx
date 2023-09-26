import { useBracketSingle } from './hooks/usebracketSingle';

export const BracketSingle = () => {
	const { singleBracket, isLoading } = useBracketSingle();
	if (isLoading) return <div>Loading...</div>;

	return (
		<>
			<div>BracketSingle</div>
			<div>{singleBracket?.name}</div>
		</>
	);
};
