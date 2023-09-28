import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { Column } from './components/Column';
import { useBracketSingle } from './hooks/useBracketSingle';
import { BracketSingle__WrapperStyled } from './styled';
import { useRef } from 'react';
import { CreateMatch } from './components/CreateMatch';
import { useCreateMatch } from './components/CreateMatch/hooks/useCreateMatch';
import { CreateMatchT } from './components/CreateMatch/types';

export const BracketSingle = () => {
	const container = useRef<HTMLDivElement>(null);

	const { isOpenCreateMatchModal, createMatchCloseModal, createMatchOpenModal, getCreatedMatch } = useCreateMatch();

	const { columns, matches, isLoading, renderMatch, onDragStart, onDragEnd, addMatch } = useBracketSingle({
		container,
		createMatchOpenModal,
	});

	const submitMatchHandler = (data: CreateMatchT) => {
		const match = getCreatedMatch(data);
		addMatch(match);
		createMatchCloseModal();
	};

	if (isLoading) return <div>Loading...</div>;
	return (
		<BracketSingle__WrapperStyled ref={container} id='qwe'>
			<DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
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
			<CreateMatch
				submitMatchHandler={submitMatchHandler}
				defaultMatchNumber={matches.length + 1}
				isOpenCreateMatchModal={isOpenCreateMatchModal}
				createMatchCloseModal={createMatchCloseModal}
			/>
		</BracketSingle__WrapperStyled>
	);
};
