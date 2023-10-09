import CircularProgress from '@mui/material/CircularProgress';
import { Loader__InnerWrapperStyled, Loader__WrapperStyled } from './styled';

export const Loader = () => {
	return (
		<Loader__WrapperStyled>
			<Loader__InnerWrapperStyled>
				<CircularProgress color="secondary" size={100} />
			</Loader__InnerWrapperStyled>
		</Loader__WrapperStyled>
	);
};
