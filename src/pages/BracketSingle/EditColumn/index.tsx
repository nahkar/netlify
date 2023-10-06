import { Box, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import { SubmitHandler, useForm } from 'react-hook-form';
import { FormErrorStyled } from 'styles/shared';

type CreateMatchT = {
	roundName: string;
};

type PropsT = {
	columnId: string;
	name: string;
	editColumn: (data: { name: string; id: string }) => void;
	removeColumn: (id: string) => void;
	isShowColumnEditModal: boolean;
	hideEditColumnModal: () => void;
};

export const EditColumn = ({
	editColumn,
	removeColumn,
	columnId,
	isShowColumnEditModal,
	hideEditColumnModal,
	name,
}: PropsT) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<CreateMatchT>();

	const onSubmit: SubmitHandler<CreateMatchT> = (data) => {
		editColumn({ name: data.roundName, id: columnId });
		hideEditColumnModal();
	};

	const removeColumnHandler = () => {
		removeColumn(columnId);
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
						{errors.roundName && <FormErrorStyled>This field is required</FormErrorStyled>}
					</Box>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button sx={{ marginRight: 'auto' }} color='error' onClick={removeColumnHandler}>
					Remove
				</Button>
				<Button onClick={hideEditColumnModal}>Close</Button>
				<Button onClick={handleSubmit(onSubmit)} autoFocus>
					Edit
				</Button>
			</DialogActions>
		</Dialog>
	);
};
