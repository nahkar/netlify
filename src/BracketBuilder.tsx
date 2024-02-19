import React from 'react';
import { App } from './app';
import { AppProvider } from './providers/AppProvider';

export const BracketBuilder = () => {
	return (
		<AppProvider>
			<App />
		</AppProvider>
	);
};
