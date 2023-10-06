import { styled } from 'styled-components';
import { ThemeT } from './theme';

export const FormErrorStyled = styled.div<ThemeT>`
	color: ${(props) => props.theme.light.colors.error.main};
	font-size: 12px;
	padding: 3px 0 0 0;
`;
