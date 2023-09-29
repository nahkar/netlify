import { Box, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import { SubmitHandler, useForm } from 'react-hook-form';

type CreateMatchT = {
	roundName: string;
};

type PropsT = {
	columnId: string;
	name: string;
	editColumn: (data: { name: string; id: string }) => void;
	isShowColumnEditModal: boolean;
	hideEditColumnModal: () => void;
};

export const EditColumn = ({ editColumn, columnId, isShowColumnEditModal, hideEditColumnModal, name }: PropsT) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<CreateMatchT>();

	const onSubmit: SubmitHandler<CreateMatchT> = (data) => {
		editColumn({ name: data.roundName, id: columnId });
		hideEditColumnModal();
	};

	return (
		<Dialog fullWidth open={isShowColumnEditModal} onClose={hideEditColumnModal}>
			<DialogTitle>Edit Round</DialogTitle>
			<DialogContent>
				<Box component='form' noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
					<Box sx={{ mt: 1 }} component='div'>
						<TextField
							fullWidth
							defaultValue={name}
							size='small'
							label='Round Name'
							variant='outlined'
							{...register('roundName', { required: true })}
						/>
						{errors.roundName && <div>This field is required</div>}
					</Box>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={hideEditColumnModal}>Close</Button>
				<Button onClick={handleSubmit(onSubmit)} autoFocus>
					Create
				</Button>
			</DialogActions>
		</Dialog>
	);
};
