import { styled } from 'styled-components';

export const Resizer__WrapperStyled = styled.div`
	width: 45px;
	background: ${(props) => props.theme.light.colors.info.dark};
	border-radius: 5px;
	position: fixed;
	left: 0;
	padding: 5px 3px;
	button {
		color:  ${(props) => props.theme.light.colors.info.contrast};
	}
	top: 25%;
`;
