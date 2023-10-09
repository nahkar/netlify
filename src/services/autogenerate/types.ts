export type PrevMatchIdT = string | null;
export type PrevMatchIdsT = null | [string] | [PrevMatchIdT, PrevMatchIdT] | [PrevMatchIdT, null] | [null, PrevMatchIdT];

export interface IParticipant {
	teamName: string;
	isByes: boolean;
}

export interface IConvertedMatch {
	id: string;
	round: number;
	prevMatch: PrevMatchIdsT;
	nextMatchId?: null | string;
	participants: IParticipant[];
}

export interface INode {
	name: string;
	isByes: boolean;
	prevMatch: string;
	children: INode[];
}
