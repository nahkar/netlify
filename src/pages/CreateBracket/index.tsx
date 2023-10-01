import {
	Autocomplete,
	Box,
	Button,
	FormControlLabel,
	FormGroup,
	MenuItem,
	Select,
	Switch,
	TextField,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useCreateBracket } from './hooks/useCreateBracket';
import { CreateBracketInputsT, TemplateTypeT } from './types';
import { MIN_TEAMS_FOR_LOSERS_3, MIN_TEAMS_FOR_LOSERS_5 } from '../../config';
import { CreateBracket__WrapperStyled } from './styled';
import { FormErrorStyled } from 'styles/shared';

export const CreateBracket = () => {
	const { templateType, setTemplateType, isMakeDuplicate, setIsMakeDuplicate, brackets, submitHandler } =
		useCreateBracket();
	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm<CreateBracketInputsT>();

	const isNewBracketType = templateType === 'new_bracket';
	const isSavedBracketType = templateType === 'saved_brackets';
	const countOfTeams = Number(watch('countOfTeams'));

	return (
		<CreateBracket__WrapperStyled component='form' noValidate autoComplete='off' onSubmit={handleSubmit(submitHandler)}>
			<Box sx={{ width: '100%', mb: 2 }}>
				<Select
					size='small'
					fullWidth
					label='Select Template'
					value={templateType}
					onChange={(e) => setTemplateType(e.target.value as TemplateTypeT)}
				>
					<MenuItem value='new_bracket'>Create new Bracket</MenuItem>
					<MenuItem value='saved_brackets'>Saved Brackets</MenuItem>
				</Select>
			</Box>
			{isNewBracketType && (
				<Box sx={{ width: '100%', mb: 2 }}>
					<TextField
						fullWidth
						size='small'
						label='Bracket Name'
						variant='outlined'
						{...register('bracketName', { required: isNewBracketType })}
					/>
					{errors.bracketName && <FormErrorStyled>This field is required</FormErrorStyled>}
				</Box>
			)}

			{isNewBracketType && (
				<Box sx={{ width: '100%', mb: 2 }}>
					<TextField
						fullWidth
						type='number'
						InputProps={{
							inputProps: {
								min: 0,
							},
						}}
						size='small'
						label='Count of Teams'
						variant='outlined'
						{...register('countOfTeams', { required: isNewBracketType })}
					/>
					{errors.countOfTeams && <FormErrorStyled>This field is required</FormErrorStyled>}
				</Box>
			)}

			{isNewBracketType && countOfTeams >= MIN_TEAMS_FOR_LOSERS_5 && (
				<Box sx={{ width: '100%', mb: 2 }}>
					<FormGroup>
						<FormControlLabel
							control={<Switch {...register('isHigherSeedsTeamsLogic')} />}
							label='Higher Seeds Teams Logic'
						/>
					</FormGroup>
				</Box>
			)}
			{isNewBracketType && countOfTeams >= MIN_TEAMS_FOR_LOSERS_3 && (
				<Box sx={{ width: '100%', mb: 2 }}>
					<FormGroup>
						<FormControlLabel control={<Switch {...register('isThirdPlace')} />} label='Match for the 3d place' />
					</FormGroup>
				</Box>
			)}
			{isNewBracketType && countOfTeams >= MIN_TEAMS_FOR_LOSERS_5 && (
				<Box sx={{ width: '100%', mb: 2 }}>
					<FormGroup>
						<FormControlLabel control={<Switch {...register('isFifthPlace')} />} label='Match for the 5th place' />
					</FormGroup>
				</Box>
			)}

			{isSavedBracketType && (
				<Box sx={{ width: '100%', mb: 2 }}>
					<Autocomplete
						size='small'
						fullWidth
						disablePortal
						options={brackets}
						renderInput={(params) => (
							<TextField
								{...params}
								label='Select Saved Bracket'
								{...register('selectedSavedBracket', { required: isSavedBracketType })}
							/>
						)}
					/>
					{errors.selectedSavedBracket && <FormErrorStyled>This field is required</FormErrorStyled>}
				</Box>
			)}
			{isSavedBracketType && (
				<Box sx={{ width: '100%', mb: 2 }}>
					<FormGroup>
						<FormControlLabel
							control={<Switch />}
							label='Make Duplicate ?'
							checked={isMakeDuplicate}
							onChange={() => setIsMakeDuplicate((prev) => !prev)}
						/>
					</FormGroup>
				</Box>
			)}
			{isSavedBracketType && isMakeDuplicate && (
				<Box sx={{ width: '100%', mb: 2 }}>
					<TextField
						size='small'
						label='Duplicate Name'
						variant='outlined'
						{...register('duplicateName', { required: isSavedBracketType && isMakeDuplicate })}
					/>
					{errors.duplicateName && <FormErrorStyled>This field is required</FormErrorStyled>}
				</Box>
			)}
			<Box sx={{ width: '100%', mb: 2 }}>
				<Button type='submit' variant='contained' size='medium' fullWidth>
					Generate Bracket
				</Button>
			</Box>
		</CreateBracket__WrapperStyled>
	);
};
