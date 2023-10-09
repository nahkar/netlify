import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Header } from './';
import { AppProvider } from '../../providers/AppProvider';
import { describe, it, expect, beforeEach } from 'vitest';

describe('<Header />', () => {
	beforeEach(() => {
		render(
			<AppProvider>
				<Header />
			</AppProvider>,
		);
	});

	it('Should render  <Header />', () => {
		expect(screen.getByTestId('header')).toBeInTheDocument();
	});
	it('Should show header title', () => {
		expect(screen.getByText(/Bracket Builder/i)).toBeInTheDocument();
	});

	it('Should show menu button', () => {
		expect(screen.getByTestId('user-menu')).toBeInTheDocument();
	});
});
