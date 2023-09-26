import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { GlobalStyle } from '../globalStyles';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { QueryClient, QueryClientProvider } from 'react-query';

type PropsT = { children: React.ReactNode };

export const AppProvider = ({ children }: PropsT) => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				refetchOnWindowFocus: false,
			},
		},
	});

	return (
		<BrowserRouter>
			<GlobalStyle />
			<ToastContainer />
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</BrowserRouter>
	);
};
