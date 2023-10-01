import { Input, Select } from "@mui/joy";
import styled from "styled-components";

export const SearchWrapperStyled = styled.div`
	padding: 10px 0;
	display: flex;
	position: relative;
	width: 500px;
`;

export const InputStyled = styled(Input)`
	width: 500px;
	input{
		padding-right: 118px;
	}
`
export const SelectStyled = styled(Select)`
	width: 150px;
	position: absolute;
	right: 118px;
`