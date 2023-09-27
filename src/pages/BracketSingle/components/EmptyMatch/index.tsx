import { EmptyMatch__MatchStyled } from './styled';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';

type PropsT = {
	isDraging: boolean;
}
export const EmptyMatch = ({isDraging}: PropsT) => (
	<EmptyMatch__MatchStyled
		$isDraging={isDraging}
	>
		<AddCircleOutlineOutlinedIcon titleAccess='Create Round' />
	</EmptyMatch__MatchStyled>
);
