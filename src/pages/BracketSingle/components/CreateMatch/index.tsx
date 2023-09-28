import { Box, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { SubmitHandler, useForm } from 'react-hook-form';
import { CreateMatchT } from './types';

type PropsT = {
	defaultMatchNumber: number;
	isOpenCreateMatchModal: boolean;
	createMatchCloseModal: () => void;
	submitMatchHandler: SubmitHandler<CreateMatchT>
};


export const CreateMatch = ({ defaultMatchNumber = 1, isOpenCreateMatchModal, createMatchCloseModal, submitMatchHandler }: PropsT) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<CreateMatchT>();


	return (
		<Dialog fullWidth open={isOpenCreateMatchModal} onClose={createMatchCloseModal}>
			<DialogTitle>Create New Match</DialogTitle>
			<DialogContent>
				<Box component='form' noValidate autoComplete='off' onSubmit={handleSubmit(submitMatchHandler)}>
					<Box sx={{ mt: 1 }} component='div'>
						<TextField
							fullWidth
							type='number'
							defaultValue={defaultMatchNumber}
							InputProps={{
								inputProps: {
									min: 0,
								},
							}}
							size='small'
							label='Match Number'
							variant='outlined'
							{...register('matchNumber', { required: true })}
						/>
						{errors.matchNumber && <div>This field is required</div>}
					</Box>
					<Box sx={{ mt: 3 }} component='div'>
						<TextField
							fullWidth
							size='small'
							label='The First Team Name'
							variant='outlined'
							defaultValue='Team'
							{...register('firstTeamName', { required: true })}
						/>
						{errors.firstTeamName && <div>This field is required</div>}
					</Box>
					<Box sx={{ mt: 3 }} component='div'>
						<TextField
							fullWidth
							size='small'
							label='The Second Team Name'
							variant='outlined'
							defaultValue='Team'
							{...register('secondTeamName', { required: true })}
						/>
						{errors.secondTeamName && <div>This field is required</div>}
					</Box>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={createMatchCloseModal}>Close</Button>
				<Button onClick={handleSubmit(submitMatchHandler)} autoFocus>
					Create
				</Button>
			</DialogActions>
		</Dialog>
	);
};
