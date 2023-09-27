import { Column } from './components/Column';
import { useBracketSingle } from './hooks/usebracketSingle';
import { BracketSingle__WrapperStyled } from './styled';

export const BracketSingle = () => {
	const { columns, matches, isLoading, renderMatch } = useBracketSingle();
	if (isLoading) return <div>Loading...</div>;

	return (
		<>
			<BracketSingle__WrapperStyled>
				{columns.map((column) => (
					<Column key={column.id} column={column}>
						{renderMatch({ column, matches })}
					</Column>
				))}
			</BracketSingle__WrapperStyled>
		</>
	);
};
