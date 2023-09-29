import { DragDropContext, Droppable } from 'dnd';
import { Column } from './components/Column';
import { BracketSingle__WrapperStyled } from './styled';
import { useRef } from 'react';
import { CreateMatch } from './components/CreateMatch';
import { useCreateMatch } from './components/CreateMatch/hooks/useCreateMatch';
import { CreateMatchT } from './components/CreateMatch/types';
import { BracketInfo } from './components/BracketInfo';
import { useBracketSingle } from './hooks/usebracketSingle';
import { Resizer } from './components/Resizer';
import { CreateColumn } from './components/CreateColumn';

export const BracketSingle = () => {
	const container = useRef<HTMLDivElement>(null);

	const { isOpenCreateMatchModal, createMatchCloseModal, createMatchOpenModal, getCreatedMatch } = useCreateMatch();

	const {
		columns,
		matches,
		isLoading,
		renderMatch,
		onDragStart,
		onDragEnd,
		addMatch,
		instance,
		bracketName,
		changeBracketName,
		addColumn,
	} = useBracketSingle({
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
		<>
			<Resizer instance={instance} />
			<BracketInfo
				columns={columns}
				matches={matches}
				instance={instance}
				bracketName={bracketName}
				changeBracketName={changeBracketName}
			/>
			<BracketSingle__WrapperStyled ref={container}>
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
				<CreateColumn addColumn={addColumn} />
				<CreateMatch
					submitMatchHandler={submitMatchHandler}
					defaultMatchNumber={matches.length + 1}
					isOpenCreateMatchModal={isOpenCreateMatchModal}
					createMatchCloseModal={createMatchCloseModal}
				/>
			</BracketSingle__WrapperStyled>
		</>
	);
};
