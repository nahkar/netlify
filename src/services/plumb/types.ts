import {  jsPlumbInstance } from 'jsplumb';
import { IMatch } from '../../interfaces/match.interface';
import { Dispatch, SetStateAction } from 'react';

export type DeleteConnectionsAndEndpointsT = {
	matchIdWithPrefix: string;
	instance: jsPlumbInstance;
};
export type DeleteManagedElementT = {
	matchIdWithPrefix: string;
	instance: jsPlumbInstance;
};

export type PlumbDevelopT = jsPlumbInstance & { getManagedElements: () => any };

export type SetListenersT = {
	instance: jsPlumbInstance;
	matches: IMatch[];
	setMatches: Dispatch<SetStateAction<IMatch[]>>;
};

export type GetInstanceT = {
	container: HTMLDivElement;
};

export type UpdateManagedElementOnNextTickT = {
	matchIdWithPrefix: string;
	instance: jsPlumbInstance;
};

export type SetInitialEndpointT = {
	instance: jsPlumbInstance;
	match: IMatch;
	isLastColumn: boolean;
	matchRef?: HTMLDivElement;
	matchIdWithPrefix?: string;
};

export type UpdateRelationT = {
	matches: IMatch[];
	targetId: string;
	sourceId: string;
	setMatches: Dispatch<SetStateAction<IMatch[]>>;
	type: 'AddRelation' | 'RemoveRelation';
};