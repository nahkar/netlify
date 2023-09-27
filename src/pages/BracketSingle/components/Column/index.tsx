import { IColumn } from "../../../../interfaces/column.interface";
import { Column__TitleStyled, Column__WrapperStyled } from "./styled";

type PropsT = {
	column: IColumn;
	children: React.ReactNode
}
export const Column = ({ column,children }: PropsT) => {
	return (
		<Column__WrapperStyled>
			<Column__TitleStyled>{column.name}</Column__TitleStyled>
			{children}
		</Column__WrapperStyled>
	)
};