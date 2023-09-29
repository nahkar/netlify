import { jsPlumbInstance } from 'jsplumb';
import { useEffect, useState } from 'react';
import { changeZoom } from '../../../../../services/plumb';
import { DEFAULT_ZOOM, MAX_ZOOM_VALUE, MIN_ZOOM_VALUE, STEP_ZOOM } from '../../../../../constants';

type PropsT = {
	instance: jsPlumbInstance | null;
};

type useZoomResult = {
	zoom: number;
	increase: () => void;
	decrease: () => void;
	restore: () => void;
};

export const useZoom = ({ instance }: PropsT): useZoomResult => {
	const [zoom, setZoom] = useState(DEFAULT_ZOOM);
	const checkResizeValue = (value: number, type: 'increase' | 'decrease') => {
		const zoom = parseInt(`${value * 100}`);
		if (zoom >= MAX_ZOOM_VALUE && type === 'increase') {
			return false;
		}
		if (zoom <= MIN_ZOOM_VALUE && type === 'decrease') {
			return false;
		}

		return true;
	};
	useEffect(() => {
		instance && instance.repaintEverything();
	}, [zoom, instance]);
	const increase = () => {
		setZoom((prev) => {
			if (checkResizeValue(prev, 'increase')) {
				changeZoom(prev + STEP_ZOOM, instance);
				return prev + STEP_ZOOM;
			}
			return prev;
		});
	};
	const decrease = () => {
		setZoom((prev) => {
			if (checkResizeValue(prev, 'decrease')) {
				changeZoom(prev - STEP_ZOOM, instance);
				return prev - STEP_ZOOM;
			}
			return prev;
		});
	};

	const restore = () => {
		if (zoom === DEFAULT_ZOOM) {
			return;
		}
		setZoom(DEFAULT_ZOOM);
		changeZoom(DEFAULT_ZOOM, instance);
	};

	return {
		zoom,
		increase,
		decrease,
		restore,
	};
};
