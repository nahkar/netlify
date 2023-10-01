import { EditColumn } from '../../EditColumn';
import { IColumn } from 'interfaces/column.interface';
import { Column__TitleStyled, Column__WrapperStyled } from './styled';
import { useCallback, useState } from 'react';

type PropsT = {
	column: IColumn;
	children: React.ReactNode;
	editColumn: (data: { name: string; id: string }) => void;
};
export const Column = ({ column, editColumn, children }: PropsT) => {
	const [isShowColumnEditModal, setIsShowColumnEditModal] = useState(false);

	const hideEditColumnModal = useCallback(() => {
		setIsShowColumnEditModal(false);
	}, []);

	return (
		<>
			<Column__WrapperStyled>
				<Column__TitleStyled onClick={() => setIsShowColumnEditModal(true)}>{column.name}</Column__TitleStyled>
				{children}
			</Column__WrapperStyled>
			<EditColumn
				name={column.name}
				editColumn={editColumn}
				columnId={column.id}
				isShowColumnEditModal={isShowColumnEditModal}
				hideEditColumnModal={hideEditColumnModal}
			/>
		</>
	);
};
