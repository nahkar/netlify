import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
	* {
		font-family: 'Source Sans Pro', sans-serif;
		font-size: 16px;
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}
	.jtk-overlay{
			cursor: pointer;
			background: ${(props) => props.theme.light.colors.error.main};
			color: #fff;
			border-radius: 100%;
			font-size: 6px;
			width: 15px;
			text-align: center;
			height: 15px;
			display: flex;
			justify-content: center;
			align-items: center;
			transition: width 0.5s, height 0.5s;
			z-index: 9;
			&:hover{
				transition: width 0.5s, height 0.5s;
				width: 20px;
				height: 20px;
				font-size: 8px
			}
		}
`;
