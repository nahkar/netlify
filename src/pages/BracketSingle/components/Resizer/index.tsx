import { Resizer__WrapperStyled } from './styled';
import TextDecreaseTwoToneIcon from '@mui/icons-material/TextDecreaseTwoTone';
import TextIncreaseTwoToneIcon from '@mui/icons-material/TextIncreaseTwoTone';
import SettingsOverscanOutlinedIcon from '@mui/icons-material/SettingsOverscanOutlined';
import { Box, IconButton, Tooltip } from '@mui/material';
import { useZoom } from './hooks/useZoom';
import { jsPlumbInstance } from 'jsplumb';

type PropsT = {
	instance: jsPlumbInstance | null;
};

export const Resizer = ({ instance }: PropsT) => {
	const { increase, decrease, restore, zoom } = useZoom({ instance });
	return (
		<Resizer__WrapperStyled>
			{/* //* This is a hidden input for correct working of zoom */}
			<input id='zoom' type='hidden' value={zoom} />
			<Box
				component='div'
				sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}
			>
				<Tooltip title='Decrease' placement='right'>
					<IconButton size='small' onClick={decrease}>
						<TextDecreaseTwoToneIcon fontSize='small' />
					</IconButton>
				</Tooltip>
				<Box component='div' sx={{ color: 'primary.contrastText', fontSize: '12px', borderTop: '1px solid #fff' }}>
					<Tooltip title='Restore' placement='right'>
						<IconButton size='small' onClick={restore}>
							<SettingsOverscanOutlinedIcon fontSize='small' />
						</IconButton>
					</Tooltip>
				</Box>
				<Box component='div' sx={{ color: 'primary.contrastText', fontSize: '12px', borderTop: '1px solid #fff' }}>
					<Tooltip title='Increase' placement='right'>
						<IconButton size='small' onClick={increase}>
							<TextIncreaseTwoToneIcon fontSize='small' />
						</IconButton>
					</Tooltip>
				</Box>
				<Tooltip title='Current value' placement='right'>
					<Box
						component='div'
						sx={{
							color: 'primary.contrastText',
							fontSize: '12px',
							borderTop: '1px solid #fff',
							pt: '5px',
							cursor: 'default',
						}}
					>
						{parseInt(`${zoom * 100}`)}%
					</Box>
				</Tooltip>
			</Box>
		</Resizer__WrapperStyled>
	);
};
