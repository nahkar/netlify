import { styled } from 'styled-components';
import { ThemeT } from 'styles/theme';

export const Resizer__WrapperStyled = styled.div<ThemeT>`
	width: 45px;
	background: ${(props) => props.theme.light.colors.info.dark};
	border-radius: 5px;
	position: fixed;
	left: 0;
	padding: 5px 3px;
	z-index: 9;
	button {
		color: ${(props) => props.theme.light.colors.info.contrast};
	}
	top: 25%;
`;
