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
import { ChangeBracketNameForm } from './ChangeBracketNameForm';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Box, IconButton } from '@mui/material';
import BadgeIcon from '@mui/icons-material/Badge';
type PropsT = {
	columns: IColumn[];
	matches: IMatch[];
	instance: jsPlumbInstance | null;
	bracketName: string;
	changeBracketName: (name: string) => void;
};
export const BracketInfo = ({ columns, matches, instance, bracketName, changeBracketName }: PropsT) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [isShowEditBracketNameForm, setIsShowEditBracketNameForm] = useState(false);
	const changeName = (bracketName: string) => {
		changeBracketName(bracketName);
		setIsShowEditBracketNameForm(false);
	};
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
						<FormControl orientation='horizontal' sx={{ gap: 1, alignItems: 'center' }}>
							<BadgeIcon fontSize='small' sx={{ mx: 1 }} />
							{!isShowEditBracketNameForm && (
								<>
									<FormLabel>Name:</FormLabel>
									<FormLabel>{bracketName}</FormLabel>
								</>
							)}
							<FormLabel>
								{!isShowEditBracketNameForm && (
									<IconButton onClick={() => setIsShowEditBracketNameForm(true)}>
										<EditOutlinedIcon fontSize='small' />
									</IconButton>
								)}
							</FormLabel>
							{isShowEditBracketNameForm && (
								<Box sx={{ ml: -2, mt: -1 }}>
									<ChangeBracketNameForm bracketName={bracketName} changeBracketName={changeName} />
								</Box>
							)}
						</FormControl>
						<FormControl orientation='horizontal' sx={{ gap: 1, alignItems: 'center' }}>
							<Groups2RoundedIcon sx={{ mx: 1 }} />
							<FormLabel>Teams:</FormLabel>
							<FormLabel>{getAllTeams(matches).length}</FormLabel>
						</FormControl>
						<FormControl orientation='horizontal' sx={{ gap: 1, alignItems: 'center' }}>
							<ScoreboardRoundedIcon sx={{ mx: 1 }} />
							<FormLabel>Matches:</FormLabel>
							<FormLabel>{matches.length}</FormLabel>
						</FormControl>
						<FormControl orientation='horizontal' sx={{ gap: 1, alignItems: 'center' }}>
							<EmojiEventsRoundedIcon sx={{ mx: 1 }} />
							<FormLabel>Rounds:</FormLabel>
							<FormLabel>{columns.length}</FormLabel>
						</FormControl>
					</Stack>
				</AccordionDetails>
			</Accordion>
		</AccordionGroup>
	);
};
