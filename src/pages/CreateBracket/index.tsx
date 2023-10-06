import {
	AccordionDetails,
	AccordionSummary,
	Autocomplete,
	Box,
	Button,
	FormControlLabel,
	FormGroup,
	MenuItem,
	Select,
	Switch,
	TextField,
	Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useCreateBracket } from './hooks/useCreateBracket';
import { CreateBracketInputsT, TemplateTypeT } from './types';
import { MIN_TEAMS_FOR_LOSERS_3, MIN_TEAMS_FOR_LOSERS_5 } from '../../config';
import { CreateBracket__AccordionStyled, CreateBracket__WrapperStyled } from './styled';
import { FormErrorStyled } from 'styles/shared';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { theme } from 'styles/theme';
import { useEffect, useState } from 'react';
import { Loader } from 'components/Loader';

export const CreateBracket = () => {
	const { templateType, setTemplateType, isMakeDuplicate, setIsMakeDuplicate, bracketsOption, submitHandler, isShowLoader } =
		useCreateBracket();
	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
		setValue,
	} = useForm<CreateBracketInputsT>();

	const isNewBracketType = templateType === 'new_bracket';
	const isSavedBracketType = templateType === 'saved_brackets';
	const countOfTeams = Number(watch('countOfTeams'));

	const [isThirdPlaceChecked, setIsThirdPlaceChecked] = useState(false);
	const [isFifthPlaceChecked, setIsFifthPlaceChecked] = useState(false);

	const isShowAdvancedOptions = isThirdPlaceChecked || isFifthPlaceChecked;

	useEffect(() => {
		if (isFifthPlaceChecked) {
			setIsThirdPlaceChecked(true);
			setValue('isThirdPlace', true);
		}
	}, [isFifthPlaceChecked, setValue]);

	const getSubmitButtonlabel = () => {
		let submitButtonLabel = 'Generate Bracket';

		if (isSavedBracketType && isMakeDuplicate) {
			submitButtonLabel = 'Generate Duplicate';
		}
		if (isSavedBracketType && !isMakeDuplicate) {
			submitButtonLabel = 'Open Saved Bracket';
		}

		return submitButtonLabel;
	};

	return (
		<CreateBracket__WrapperStyled component="form" noValidate autoComplete="off" onSubmit={handleSubmit(submitHandler)}>
			{isShowLoader && <Loader />}
			<Box sx={{ width: '100%', mb: 2 }}>
				<Select
					size="small"
					fullWidth
					label="Select Template"
					value={templateType}
					onChange={(e) => setTemplateType(e.target.value as TemplateTypeT)}
				>
					<MenuItem value="new_bracket">Create new Bracket</MenuItem>
					<MenuItem value="saved_brackets">Saved Brackets</MenuItem>
				</Select>
			</Box>
			{isNewBracketType && (
				<Box sx={{ width: '100%', mb: 2 }}>
					<TextField
						fullWidth
						size="small"
						label="Bracket Name"
						variant="outlined"
						{...register('bracketName', { required: isNewBracketType })}
					/>
					{errors.bracketName && <FormErrorStyled>This field is required</FormErrorStyled>}
				</Box>
			)}

			{isNewBracketType && (
				<Box sx={{ width: '100%', mb: 2 }}>
					<TextField
						fullWidth
						type="number"
						InputProps={{
							inputProps: {
								min: 2,
							},
						}}
						size="small"
						label="Count of Teams"
						variant="outlined"
						{...register('countOfTeams', { required: isNewBracketType, min: 2 })}
					/>
					{errors.countOfTeams && <FormErrorStyled>This field is required</FormErrorStyled>}
				</Box>
			)}

			{isNewBracketType && countOfTeams >= MIN_TEAMS_FOR_LOSERS_5 && (
				<Box sx={{ width: '100%', mb: 2 }}>
					<FormControlLabel control={<Switch defaultChecked {...register('isHigherSeedsTeamsLogic')} />} label="Higher Seeds Teams Logic" />
				</Box>
			)}
			{isNewBracketType && countOfTeams >= MIN_TEAMS_FOR_LOSERS_3 && (
				<Box sx={{ width: '100%', mb: 2 }}>
					<FormControlLabel
						control={
							<Switch
								{...register('isThirdPlace')}
								checked={isThirdPlaceChecked}
								onChange={(e) => setIsThirdPlaceChecked(e.target.checked)}
							/>
						}
						label="Match for the 3d place"
					/>
				</Box>
			)}
			{isNewBracketType && countOfTeams >= MIN_TEAMS_FOR_LOSERS_5 && (
				<Box sx={{ width: '100%', mb: 2 }}>
					<FormControlLabel
						control={
							<Switch
								{...register('isFifthPlace')}
								checked={isFifthPlaceChecked}
								onChange={(e) => setIsFifthPlaceChecked(e.target.checked)}
							/>
						}
						label="Match for the 5th place"
					/>
				</Box>
			)}

			{isSavedBracketType && (
				<Box sx={{ width: '100%', mb: 2 }}>
					<Autocomplete
						size="small"
						fullWidth
						disablePortal
						options={bracketsOption}
						renderInput={(params) => (
							<TextField {...params} label="Select Saved Bracket" {...register('selectedSavedBracket', { required: isSavedBracketType })} />
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
							label="Make Duplicate ?"
							checked={isMakeDuplicate}
							onChange={() => setIsMakeDuplicate((prev) => !prev)}
						/>
					</FormGroup>
				</Box>
			)}
			{isSavedBracketType && isMakeDuplicate && (
				<Box sx={{ width: '100%', mb: 2 }}>
					<TextField
						fullWidth
						size="small"
						label="Duplicate Name"
						variant="outlined"
						{...register('duplicateName', { required: isSavedBracketType && isMakeDuplicate })}
					/>
					{errors.duplicateName && <FormErrorStyled>This field is required</FormErrorStyled>}
				</Box>
			)}
			{isShowAdvancedOptions && (
				<CreateBracket__AccordionStyled sx={{ mb: 2 }}>
					<AccordionSummary expandIcon={<ExpandMoreIcon />}>
						<Typography color={theme.light.colors.info.main}>Advanced Options</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<Box sx={{ width: '100%', mb: 2 }}>
							<FormGroup>
								<FormControlLabel control={<Switch {...register('isRightSide')} />} label="Cancelation Matches are Right Side" />
							</FormGroup>
						</Box>
					</AccordionDetails>
				</CreateBracket__AccordionStyled>
			)}
			<Box sx={{ width: '100%', mb: 2 }}>
				<Button type="submit" variant="contained" size="medium" fullWidth>
					{getSubmitButtonlabel()}
				</Button>
			</Box>
		</CreateBracket__WrapperStyled>
	);
};
