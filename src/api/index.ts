import axios from 'axios';
import { IBracket } from 'interfaces/bracket.interface';

const axiosInstance = axios.create({
	baseURL: process.env.VITE_BASE_URL,
});

export const api = {
	fetchBrackets: async () => {
		const { data } = await axiosInstance.get<IBracket[]>(`/bracket`);
		return data;
	},
	fetchBracket: async (id: string) => {
		const { data } = await axiosInstance.get<IBracket>(`/bracket/${id}`);
		return data;
	},
	deleteBracket: async (id: string) => {
		const { data } = await axiosInstance.delete<IBracket>(`/bracket/${id}`);
		return data;
	},
	createBracket: async (bracket: Omit<IBracket, 'id'>) => {
		const { data } = await axiosInstance.post<IBracket>(`/bracket`, bracket);
		return data;
	},
	editBracket: async (id: string, bracket: IBracket) => {
		const { data } = await axiosInstance.put<IBracket>(`/bracket/${id}`, bracket);
		return data;
	},
};
