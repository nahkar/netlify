import { OnConnectionBindInfo, jsPlumbInstance } from 'jsplumb';
import { IMatch } from './match.interface';

export interface OnConnection extends OnConnectionBindInfo {
	dropEndpoint: {
		type: 'Dot' | 'Blank' | 'Rectangle';
	};
}

export type SetConnectionT = {
	instance: jsPlumbInstance;
	sourceMatchIdWithoutPrefix: string;
	targetMatchIdWithoutPrefix: string;
};

export type SetPrevAndNextMatchConnectionsT = {
	instance: jsPlumbInstance;
	matches: IMatch[];
	draggableMatch: IMatch | null;
}