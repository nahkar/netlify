import { Box, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { EditMatchT, IMatch } from 'interfaces/match.interface';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { FormErrorStyled } from 'styles/shared';

type PropsT = {
	editableMatchId: string;
	match: IMatch;
	toogleEditMatchModal: (matchId: string) => void;
	editMatchHandler: (match: EditMatchT & { id: string }) => void;
};

export const EditMatch = ({ toogleEditMatchModal, editableMatchId, match, editMatchHandler }: PropsT) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<EditMatchT>();

	useEffect(() => {
		if (editableMatchId === match.id) {
			setOpen(true);
		}
	}, [editableMatchId, match.id]);

	const [open, setOpen] = useState(false);

	const onSubmit: SubmitHandler<EditMatchT> = (data) => {
		editMatchHandler({ ...data, id: editableMatchId });
		setOpen(false);
		toogleEditMatchModal('');
	};

	const closeMatchModal = () => {
		setOpen(false);
		toogleEditMatchModal('');
	};

	return (
		<>
			<Dialog fullWidth open={open} onClose={closeMatchModal}>
				<DialogTitle>Edit Match</DialogTitle>
				<DialogContent>
					<Box component='form' noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
						<Box sx={{ mt: 1 }} component='div'>
							<TextField
								fullWidth
								size='small'
								label='Match Name'
								variant='outlined'
								defaultValue={match.matchName}
								{...register('matchName', { required: true })}
							/>
							{errors.matchName && <FormErrorStyled>This field is required</FormErrorStyled>}
						</Box>
						<Box sx={{ mt: 3 }} component='div'>
							<TextField
								fullWidth
								size='small'
								label='Team 1'
								variant='outlined'
								defaultValue={match.participants[0].name}
								{...register('team1Name', { required: true })}
							/>
							{errors.team1Name && <FormErrorStyled>This field is required</FormErrorStyled>}
						</Box>
						<Box sx={{ mt: 3 }} component='div'>
							<TextField
								fullWidth
								size='small'
								label='Team 2'
								variant='outlined'
								defaultValue={match.participants[1].name}
								{...register('team2Name', { required: true })}
							/>
							{errors.team2Name && <FormErrorStyled>This field is required</FormErrorStyled>}
						</Box>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={closeMatchModal}>Close</Button>
					<Button onClick={handleSubmit(onSubmit)} autoFocus>
						Update
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};
