import { styled } from 'styled-components';
import { MATCH_HEIGHT } from '../../../../config';
import { ThemeT } from '~styles/theme';

export const Match__WrapperStyled = styled.div`
	height: ${MATCH_HEIGHT}px;
`;

export const Match__ContainerStyled = styled.div<{ $isAnotherMatch: boolean }>`
	padding: 0 10px;
	transform: ${(props) => props.$isAnotherMatch && 'none !important'};
`;

export const Match__SingleWrapperStyled = styled.div<{ $isSelected: boolean; $isActive: boolean }>`
	position: relative;
	height: ${MATCH_HEIGHT}px;
	display: flex;
	align-items: center;
	z-index: 2;
	&:before {
		display: ${(props) => (props.$isSelected ? 'block' : 'none')};
		content: '';
		width: 225px;
		height: ${MATCH_HEIGHT}px;
		position: absolute;
		z-index: 9;
		background: rgba(0, 0, 0, 0.1);
		border-radius: 10px;
		border: 2px dashed #3975d1;
		margin: -4px 0 0 -27px;
		padding: 5px 2px;
		animation: borderColorChange 0.7s infinite;
	}
	@keyframes borderColorChange {
		0%,
		100% {
			border-color: lightgreen;
		}
		50% {
			border-color: darkred;
		}
	}
	.toogle-extra-data {
		visibility: ${(props) => (props.$isActive ? 'visible' : 'hidden')};
	}
`;
export const Match__SingleNumberStyled = styled.span`
	font-size: 10px;
	font-weight: bold;
	position: absolute;
	left: -21px;
	top: 50%;
	transform: translate(0, -12px);
	z-index: 2;
	color: #3975d1;
`;

export const Match__SingleParticipantWrapperStyled = styled.div`
	width: 100%;
	position: relative;
	z-index: 9;
`;

export const Match__SingleParticipantStyled = styled.div<ThemeT & { $isActive: boolean }>`
	padding: 5px;
	font-size: 14px;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
	background: ${(props) => (!props.$isActive ? props.theme.light.colors.info.dark : props.theme.light.colors.info.main)} !important;
	color: #fff;
	&:first-child {
		border-bottom: 1px solid #fff;
		border-top-left-radius: 5px;
		border-top-right-radius: 5px;
	}
	&:last-child {
		border-top: 1px solid #fff;
		border-bottom-left-radius: 5px;
		border-bottom-right-radius: 5px;
	}
`;

export const Match__SingleDescriptionStyled = styled.div<ThemeT>`
	font-size: 13px;
	color: ${(props) => props.theme.light.colors.info.main};
	position: absolute;
	top: -10px;
`;
