import '@testing-library/jest-dom';
import {  render, screen } from '@testing-library/react';
import { Search } from './';
import { AppProvider } from '../../../../../providers/AppProvider';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';


const setSearch = vi.fn();

describe('<Search />', () => {
	beforeEach(() => {
	render(
			<AppProvider>
				<Search setSearch={setSearch} search={{ type: 'id', value: '' }} />
			</AppProvider>,
		);
	});

	it('Should render  <Search />', () => {
		expect(screen.getByTestId('search-wrapper')).toBeInTheDocument();
	});

	it('Should render placeholder ', () => {
		expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
	});

	it('Should render selected value for drop down', () => {
		expect(screen.getByTestId('search-select')).toHaveTextContent('Id');
	});

	it('Default value should be empty and value should be changeable', () => {
		const inputElement = screen.getByPlaceholderText('Search');
		expect(inputElement).toHaveValue('');

		userEvent.type(inputElement, 'bracket name');
		expect(inputElement).toHaveValue('');
	});
});
