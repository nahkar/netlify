import { styled } from 'styled-components';
import { MATCH_HEIGHT } from '../../../../config';

export const EmptyMatch__WrapperStyled = styled.div`
	transform: none !important;
`;

type EmptyCustomMatchPropsT = {
	$isDraging: boolean;
};

export const EmptyMatch__MatchStyled = styled.div<EmptyCustomMatchPropsT>`
	width: 100%;
	height: ${MATCH_HEIGHT}px;
	cursor: pointer;
	border-radius: 5px;
	display: flex;
	align-items: center;
	justify-content: center;
	opacity: 0.5;
	svg {
		display: none;
	}
	&:hover {
		background: #f0f3fe;
		border: 1px dashed #008000;
		color: #008000;
		svg {
			display: ${(props) => (props.$isDraging ? 'none' : 'block')};
		}
	}
`;
