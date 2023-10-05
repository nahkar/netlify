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
	highlitedTeamId: string[];
	match: IMatch;
	instance?: jsPlumbInstance | null;
	isLastColumn: boolean;
	isSelected: boolean;
	clickMatchHandler: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, match: IMatch) => void;
	contextMenuHandler: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, match: IMatch) => void;
	handleMouseEnter: ({ match, participantIndex }: { match: IMatch; participantIndex: number }) => void;
	handleMouseLeave: () => void;
};
export const Match = ({
	match,
	instance,
	isLastColumn,
	clickMatchHandler,
	contextMenuHandler,
	isSelected,
	highlitedTeamId,
	handleMouseEnter,
	handleMouseLeave,
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
			$isActive={
				highlitedTeamId.includes(match.participants[0].id.toString()) ||
				highlitedTeamId.includes(match.participants[1].id.toString())
			}
		>
			<Match__SingleNumberStyled>M{match.matchName}</Match__SingleNumberStyled>
			<Match__SingleParticipantWrapperStyled>
				{match.participants.map((participant, index) => (
					<Match__SingleParticipantStyled
						$isActive={highlitedTeamId.includes(match.participants[index].id.toString())}
						key={participant.id}
						onMouseEnter={() => handleMouseEnter({ match, participantIndex: index })}
						onMouseLeave={handleMouseLeave}
					>
						{participant.name}
					</Match__SingleParticipantStyled>
				))}
			</Match__SingleParticipantWrapperStyled>
		</Match__SingleWrapperStyled>
	);
};
