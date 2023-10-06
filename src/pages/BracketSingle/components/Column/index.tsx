import { EditColumn } from '../../EditColumn';
import { IColumn } from 'interfaces/column.interface';
import { Column__TitleStyled, Column__WrapperStyled } from './styled';
import { useCallback, useState } from 'react';

type PropsT = {
	column: IColumn;
	children: React.ReactNode;
	editColumn: (data: { name: string; id: string }) => void;
	removeColumn: (id: string) => void;
};
export const Column = ({ column, editColumn, removeColumn, children }: PropsT) => {
	const [isShowColumnEditModal, setIsShowColumnEditModal] = useState(false);

	const hideEditColumnModal = useCallback(() => {
		setIsShowColumnEditModal(false);
	}, []);

	const isNotEmtyColumn = column.columnIndex !== null;
	return (
		<>
			<Column__WrapperStyled>
				<Column__TitleStyled
					onClick={() => isNotEmtyColumn && setIsShowColumnEditModal(true)}
					$isNotEmtyColumn={isNotEmtyColumn}
				>
					{column.name}
				</Column__TitleStyled>
				{isNotEmtyColumn && children}
			</Column__WrapperStyled>
			<EditColumn
				name={column.name}
				removeColumn={removeColumn}
				editColumn={editColumn}
				columnId={column.id}
				isShowColumnEditModal={isShowColumnEditModal}
				hideEditColumnModal={hideEditColumnModal}
			/>
		</>
	);
};
