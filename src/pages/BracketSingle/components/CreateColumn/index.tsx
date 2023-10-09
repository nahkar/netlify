import { Box, IconButton, TextField, Tooltip } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { FormErrorStyled } from '~styles/shared';
type CreateMatchT = {
	roundName: string;
};

type PropsT = {
	addColumn: (name: string) => void;
};

export const CreateColumn = ({ addColumn }: PropsT) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<CreateMatchT>();

	const [open, setOpen] = useState(false);

	const onSubmit: SubmitHandler<CreateMatchT> = (data) => {
		addColumn(data.roundName);
		setOpen(false);
	};

	return (
		<>
			<Box>
				<Tooltip title="Create Round" placement="right">
					<IconButton onClick={() => setOpen(true)}>
						<AddCircleOutlineOutlinedIcon />
					</IconButton>
				</Tooltip>
			</Box>
			<Dialog fullWidth open={open} onClose={() => setOpen(false)}>
				<DialogTitle>Create New Round</DialogTitle>
				<DialogContent>
					<Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
						<Box sx={{ mt: 1 }} component="div">
							<TextField
								fullWidth
								size="small"
								label="Round Name"
								variant="outlined"
								defaultValue="Round "
								{...register('roundName', { required: true })}
							/>
							{errors.roundName && <FormErrorStyled>This field is required</FormErrorStyled>}
						</Box>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpen(false)}>Close</Button>
					<Button onClick={handleSubmit(onSubmit)} autoFocus>
						Create
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};
