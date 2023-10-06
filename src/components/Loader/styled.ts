import { Box } from '@mui/joy';
import styled from 'styled-components';

export const Loader__WrapperStyled = styled.div`
	position: fixed;
	z-index: 99;
	background: #000;
	width: 100%;
	height: 100%;
	left: 0;
	top: 0;
	opacity: 0.4;
`;
export const Loader__InnerWrapperStyled = styled(Box)`
	position: absolute;
	z-index: 999;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
`;
