import { Accordion, Box } from '@mui/material';
import { styled } from 'styled-components';
import { ThemeT } from 'styles/theme';

export const CreateBracket__WrapperStyled = styled(Box)<ThemeT>`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 400px;
	margin: 50px auto 0;
	padding: 30px 30px 10px 30px;
	border-radius: 5px;
	border: 1px solid ${(props) => props.theme.light.colors.secondary.dark};
`;
export const CreateBracket__AccordionStyled = styled(Accordion)`
	border-radius: 5px !important;
	box-shadow: none !important;
	border: none !important;
	&:before {
		display: none;
	}
	&.Mui-expanded {
		margin-top: 0 !important;
	}
`;
