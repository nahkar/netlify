import { useState } from 'react';
import { IColumn } from 'interfaces/column.interface';
import { createMatch } from '../../../../../services/match.service';
import { CreateMatchT } from '../types';
import { IMatch } from 'interfaces/match.interface';

type useCreateMatchResult = {
	isOpenCreateMatchModal: boolean;
	createMatchOpenModal: ({ column, matchNumber }: { column: IColumn; matchNumber: number }) => void;
	createMatchCloseModal: () => void;
	getCreatedMatch: (data: CreateMatchT) => IMatch;
};

export const useCreateMatch = (): useCreateMatchResult => {
	const [isOpenCreateMatchModal, setIsOpenCreateMatchModal] = useState(false);
	const [currentCollumn, setCurrentCollumn] = useState<IColumn>();
	const [currentMatchNumber, setCurrentMatchNumber] = useState(0);

	const createMatchOpenModal = ({ column, matchNumber }: { column: IColumn; matchNumber: number }) => {
		setCurrentCollumn(column);
		setCurrentMatchNumber(matchNumber);
		setIsOpenCreateMatchModal(true);
	};

	const createMatchCloseModal = () => {
		setIsOpenCreateMatchModal(false);
	};

	const getCreatedMatch = (data: CreateMatchT): IMatch => {
		return createMatch({
			matchName: data.matchNumber,
			matchNumber: currentMatchNumber,
			firstParticipantName: data.firstTeamName,
			secondParticipantName: data.secondTeamName,
			column: currentCollumn!
		});
	}
	return {
		isOpenCreateMatchModal,
		createMatchOpenModal,
		createMatchCloseModal,
		getCreatedMatch
	};
};
