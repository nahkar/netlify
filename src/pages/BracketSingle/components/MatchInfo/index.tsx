import AccordionGroup from '@mui/joy/AccordionGroup';
import Accordion from '@mui/joy/Accordion';
import AccordionDetails, { accordionDetailsClasses } from '@mui/joy/AccordionDetails';
import AccordionSummary, { accordionSummaryClasses } from '@mui/joy/AccordionSummary';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import Avatar from '@mui/joy/Avatar';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import ListItemContent from '@mui/joy/ListItemContent';

import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import Groups2RoundedIcon from '@mui/icons-material/Groups2Rounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import ScoreboardRoundedIcon from '@mui/icons-material/ScoreboardRounded';
import { IMatch } from '../../../../interfaces/match.interface';
import { IColumn } from '../../../../interfaces/column.interface';
import { getAllTeams } from '../../../../services/match.service';
import { useEffect, useState } from 'react';
import { jsPlumbInstance } from 'jsplumb';

type PropsT = {
	columns: IColumn[];
	matches: IMatch[];
	instance: jsPlumbInstance | null;
};
export const BracketInfo = ({ columns, matches, instance }: PropsT) => {
	const [isExpanded, setIsExpanded] = useState(false);
	useEffect(() => {
		const interval = setInterval(() => {
			if (instance) {
				instance.repaintEverything();
			}
		});
		setTimeout(() => {
			clearInterval(interval);
		}, 500);
	}, [isExpanded]);

	return (
		<AccordionGroup
			variant='plain'
			transition='0.2s'
			sx={{
				borderRadius: 'md',
				[`& .${accordionDetailsClasses.content}.${accordionDetailsClasses.expanded}`]: {
					paddingBlock: '1rem',
				},
				[`& .${accordionSummaryClasses.button}`]: {
					paddingBlock: '1rem',
				},
			}}
		>
			<Accordion sx={{ mb: 2 }} onChange={(_, expanded) => setIsExpanded(expanded)}>
				<AccordionSummary>
					<Avatar color='primary'>
						<DescriptionRoundedIcon />
					</Avatar>
					<ListItemContent>
						<Typography level='title-md'>Bracket Info</Typography>
						<Typography level='body-sm'>
							The "Bracket Info" section provides a concise overview of key information related to a bracket. It
							includes details about matches, rounds, teams, and the bracket name.
						</Typography>
					</ListItemContent>
				</AccordionSummary>
				<AccordionDetails>
					<Stack spacing={1.5}>
						<FormControl orientation='horizontal' sx={{ gap: 1 }}>
							<Groups2RoundedIcon sx={{ mx: 1 }} />
							<FormLabel>Teams</FormLabel>
							<FormLabel>{getAllTeams(matches).length}</FormLabel>
						</FormControl>
						<FormControl orientation='horizontal' sx={{ gap: 1 }}>
							<ScoreboardRoundedIcon sx={{ mx: 1 }} />
							<FormLabel>Matches</FormLabel>
							<FormLabel>{matches.length}</FormLabel>
						</FormControl>
						<FormControl orientation='horizontal' sx={{ gap: 1 }}>
							<EmojiEventsRoundedIcon sx={{ mx: 1 }} />
							<FormLabel>Rounds</FormLabel>
							<FormLabel>{columns.length}</FormLabel>
						</FormControl>
					</Stack>
				</AccordionDetails>
			</Accordion>
		</AccordionGroup>
	);
};
