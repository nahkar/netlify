import '@testing-library/jest-dom';
import { act, getByTestId, getByText, render } from '@testing-library/react';
import { App } from './';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { describe, it, expect, vi } from 'vitest';
vi.mock('axios');

const getContainer = (path: string) => {
	const queryClient = new QueryClient();
	const { container } = render(
		<QueryClientProvider client={queryClient}>
			<MemoryRouter initialEntries={[path]}>
				<App />
			</MemoryRouter>
		</QueryClientProvider>,
	);
	return container;
};

describe('<App />', () => {
	it('Should render main layout', async () => {
		const container = getContainer('/');
		await act(async () => {
			expect(getByTestId(container, 'main-layout')).toBeInTheDocument();
		});
	});
	it('Should render main layout', async () => {
		const container = getContainer('/');
		await act(async () => {
			expect(getByText(container, /Home/i)).toBeInTheDocument();
		});
	});
	it('Should render brackets page', async () => {
		const container = getContainer('/brackets');
		await act(async () => {
			expect(getByText(container, /Brackets not found/i)).toBeInTheDocument();
		});
	});
});
