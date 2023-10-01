import { Box } from "@mui/material";
import { styled } from "styled-components";

export const CreateBracket__WrapperStyled = styled(Box)`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 400px;
	margin: 50px auto 0;
	padding: 30px 30px 10px 30px;
	border-radius: 5px;
	border: 1px solid ${(props) => props.theme.light.colors.secondary.dark};
`