import React from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from './theme';

type PropsT = {
	readonly children: React.ReactNode;
};

export const ThemeHoc = ({ children }: PropsT) => {
	return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
