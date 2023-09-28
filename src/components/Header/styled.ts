import { Link } from 'react-router-dom';
import { styled } from 'styled-components';

export const Header__LinkStyled = styled(Link)`
	color: #fff;
	text-decoration: none;
	font-size: 20px;
	font-weight: bold;
	transition: font-size 0.4s;
	&:hover {
		font-size: 22px;

	}
`;
