import { Link } from 'react-router-dom';
import { styled } from 'styled-components';

export const Header__LinkStyled = styled(Link)`
	color: #fff;
	text-decoration: none;
	font-size: 20px;
	font-weight: bold;
	transition: font-size 0.4s;
	display: block;
	&:hover {
		font-size: 22px;

	}
`;
export const Header__LinkMenuStyled = styled(Link)`
	text-decoration: none;
	font-size: 20px;
	font-weight: bold;
	transition: font-size 0.4s;
	display: block;
	&:hover {
		text-decoration: underline;

	}
`;
