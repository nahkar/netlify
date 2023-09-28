import { Box, IconButton } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ChangeBracketNameForm__TextFieldStyled } from './styled';
import SaveIcon from '@mui/icons-material/Save';

type ChangeBracketNameFormInputsT = {
	bracketName: string;
};

type PropsT = {
	bracketName: string;
	changeBracketName: (name: string) => void;
};

export const ChangeBracketNameForm = ({ bracketName = '', changeBracketName }: PropsT) => {
	const { register, handleSubmit, watch } = useForm<ChangeBracketNameFormInputsT>();

	const submitHandler: SubmitHandler<ChangeBracketNameFormInputsT> = (data) => {
		if (data.bracketName !== bracketName) {
			changeBracketName(data.bracketName);
		}
	};

	const getColorSubmitButton = () => {
		if (watch('bracketName') === undefined) {
			return 'default';
		}
		if (watch('bracketName') === '') {
			return 'error';
		}

		if (watch('bracketName') !== bracketName) {
			return 'success';
		}

		return 'default';
	};

	return (
		<Box
			component='form'
			noValidate
			autoComplete='off'
			onSubmit={handleSubmit(submitHandler)}
			sx={{ display: 'flex', alignItems: 'center' }}
		>
			<Box>
				<ChangeBracketNameForm__TextFieldStyled
					size='small'
					label='Bracket Name'
					variant='outlined'
					defaultValue={bracketName}
					{...register('bracketName', { required: true })}
				/>
			</Box>
			<IconButton sx={{ mt: 1 }} type='submit' color={getColorSubmitButton()}>
				<SaveIcon fontSize='medium' />
			</IconButton>
		</Box>
	);
};
