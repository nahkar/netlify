import { Resizer__WrapperStyled } from './styled';
import TextDecreaseTwoToneIcon from '@mui/icons-material/TextDecreaseTwoTone';
import TextIncreaseTwoToneIcon from '@mui/icons-material/TextIncreaseTwoTone';
import SettingsOverscanOutlinedIcon from '@mui/icons-material/SettingsOverscanOutlined';
import { Box, IconButton } from '@mui/material';

export const Resizer = () => {
	return (
		<Resizer__WrapperStyled>
			<Box
				component='div'
				sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}
			>
				<IconButton size='small'>
					<TextDecreaseTwoToneIcon fontSize='small' />
				</IconButton>

				<Box component='div' sx={{ color: 'primary.contrastText', fontSize: '12px', borderTop: '1px solid #fff' }}>
					<IconButton size='small'>
						<SettingsOverscanOutlinedIcon fontSize='small' />
					</IconButton>
				</Box>
				<Box component='div' sx={{ color: 'primary.contrastText', fontSize: '12px', borderTop: '1px solid #fff' }}>
					<IconButton size='small'>
						<TextIncreaseTwoToneIcon fontSize='small' />
					</IconButton>
				</Box>
				<Box
					component='div'
					sx={{ color: 'primary.contrastText', fontSize: '12px', borderTop: '1px solid #fff', pt: '5px' }}
				>
					100%
				</Box>
			</Box>
		</Resizer__WrapperStyled>
	);
};
