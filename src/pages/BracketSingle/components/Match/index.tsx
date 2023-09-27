import { IMatch } from "../../../../interfaces/match.interface"
import { Match__SingleNumberStyled, Match__SingleParticipantStyled, Match__SingleParticipantWrapperStyled, Match__SingleWrapperStyled } from "./styled"

type PropsT = {
	match: IMatch
}
export const Match = ({match}: PropsT) => {
	return (
		<Match__SingleWrapperStyled>
			<Match__SingleNumberStyled>M{match.matchName}</Match__SingleNumberStyled>
			<Match__SingleParticipantWrapperStyled>
				{match.participants.map((participant) => (
					<Match__SingleParticipantStyled key={participant.id}>{participant.name}</Match__SingleParticipantStyled>
				))}
			</Match__SingleParticipantWrapperStyled>
		</Match__SingleWrapperStyled>
	)
}