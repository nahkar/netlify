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
import { useForm, SubmitHandler } from 'react-hook-form';
import { useCreateBracket } from './hooks/useCreateBracket';
import { TemplateTypeT } from './types';
import { MIN_TEAMS_FOR_LOSERS_3, MIN_TEAMS_FOR_LOSERS_5 } from '../../constants';

type Inputs = {
	bracketName: string;
	countOfTeams: string;
	duplicateName: string;
	isThirdPlace: boolean;
	isFirstPlace: boolean;
	isHigherSeedsTeamsLogic: boolean;
	selectedSavedBracket: string;
};

export const CreateBracket = () => {
	const { templateType, setTemplateType, isMakeDuplicate, setIsMakeDuplicate, brackets } = useCreateBracket();
	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm<Inputs>();
	const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

	const isNewBracketType = templateType === 'new_bracket';
	const isSavedBracketType = templateType === 'saved_brackets';
	const countOfTeams = Number(watch('countOfTeams'));
	return (
		<>
			<div>CreateBracket</div>
			<Box component='form' noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
				<Box>
					<Select
						label='Select Template'
						value={templateType}
						onChange={(e) => setTemplateType(e.target.value as TemplateTypeT)}
					>
						<MenuItem value='new_bracket'>Create new Bracket</MenuItem>
						<MenuItem value='saved_brackets'>Saved Brackets</MenuItem>
					</Select>
				</Box>
				{isNewBracketType && (
					<Box>
						<TextField
							size='small'
							label='Bracket Name'
							variant='outlined'
							{...register('bracketName', { required: isNewBracketType })}
						/>
						{errors.bracketName && <div>This field is required</div>}
					</Box>
				)}

				{isNewBracketType && (
					<Box>
						<TextField
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
						{errors.countOfTeams && <div>This field is required</div>}
					</Box>
				)}

				{isNewBracketType && countOfTeams >= MIN_TEAMS_FOR_LOSERS_5 && (
					<Box>
						<FormGroup>
							<FormControlLabel
								control={<Switch {...register('isHigherSeedsTeamsLogic')} />}
								label='Higher Seeds Teams Logic'
							/>
						</FormGroup>
					</Box>
				)}
				{isNewBracketType && countOfTeams >= MIN_TEAMS_FOR_LOSERS_3 && (
					<Box>
						<FormGroup>
							<FormControlLabel control={<Switch {...register('isThirdPlace')} />} label='Match for the 3d place' />
						</FormGroup>
					</Box>
				)}
				{isNewBracketType && countOfTeams >= MIN_TEAMS_FOR_LOSERS_5 && (
					<Box>
						<FormGroup>
							<FormControlLabel control={<Switch {...register('isFirstPlace')} />} label='Match for the 5th place' />
						</FormGroup>
					</Box>
				)}

				{isSavedBracketType && (
					<Box>
						<Autocomplete
							disablePortal
							options={brackets}
							sx={{ width: 300 }}
							renderInput={(params) => (
								<TextField
									{...params}
									label='Select Saved Bracket'
									{...register('selectedSavedBracket', { required: isSavedBracketType })}
								/>
							)}
						/>
						{errors.selectedSavedBracket && <div>This field is required</div>}
					</Box>
				)}
				{isSavedBracketType && (
					<Box>
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
					<Box>
						<TextField
							size='small'
							label='Duplicate Name'
							variant='outlined'
							{...register('duplicateName', { required: isSavedBracketType && isMakeDuplicate })}
						/>
						{errors.duplicateName && <div>This field is required</div>}
					</Box>
				)}
				<Box>
					<Button type='submit' variant='contained' size='large'>
						Generate Bracket
					</Button>
				</Box>
			</Box>
		</>
	);
};
