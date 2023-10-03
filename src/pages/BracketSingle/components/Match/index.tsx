import { useEffect, useRef } from 'react';
import { IMatch } from '../../../../interfaces/match.interface';
import {
	Match__SingleNumberStyled,
	Match__SingleParticipantStyled,
	Match__SingleParticipantWrapperStyled,
	Match__SingleWrapperStyled,
} from './styled';
import { jsPlumbInstance } from 'jsplumb';
import { addPrefixToMatchId, setEndpoint } from '../../../../services/plumb';

type PropsT = {
	match: IMatch;
	instance?: jsPlumbInstance | null;
	isLastColumn: boolean;
	isSelected: boolean;
	clickMatchHandler: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, match: IMatch) => void;
	contextMenuHandler: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, match: IMatch) => void;
};
export const Match = ({
	match,
	instance,
	isLastColumn,
	clickMatchHandler,
	contextMenuHandler,
	isSelected,
}: PropsT) => {
	const element = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (element.current && instance) {
			setEndpoint({ instance, match, isLastColumn, matchRef: element.current });
		}
	}, [instance, match, match.columnIndex]);
	return (
		<Match__SingleWrapperStyled
			$isSelected={isSelected}
			ref={element}
			id={addPrefixToMatchId(match.id)}
			onClick={(e) => clickMatchHandler(e, match)}
			onContextMenu={(e) => contextMenuHandler(e, match)}
		>
			<Match__SingleNumberStyled>M{match.matchName}</Match__SingleNumberStyled>
			<Match__SingleParticipantWrapperStyled>
				{match.participants.map((participant) => (
					<Match__SingleParticipantStyled key={participant.id}>{participant.name}</Match__SingleParticipantStyled>
				))}
			</Match__SingleParticipantWrapperStyled>
			
		</Match__SingleWrapperStyled>
	);
};
