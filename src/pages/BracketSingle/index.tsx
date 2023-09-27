import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { Column } from './components/Column';
import { useBracketSingle } from './hooks/usebracketSingle';
import { BracketSingle__WrapperStyled } from './styled';
import { useRef } from 'react';

export const BracketSingle = () => {
	const container = useRef<HTMLDivElement>(null);

	const { columns, matches, isLoading, renderMatch, onDragStart } = useBracketSingle({
		container,
	});
	if (isLoading) return <div>Loading...</div>;
	return (
		<BracketSingle__WrapperStyled ref={container}>
			<DragDropContext onDragEnd={() => {}} onDragStart={onDragStart}>
				{columns.map((column) => (
					<Column column={column} key={column.id}>
						<Droppable droppableId={column.id}>
							{(provided) => (
								<div ref={provided.innerRef} {...provided.droppableProps}>
									{renderMatch({ column, matches })}
									{provided.placeholder}
								</div>
							)}
						</Droppable>
					</Column>
				))}
			</DragDropContext>
		</BracketSingle__WrapperStyled>
	);
};
