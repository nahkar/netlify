import { useState } from 'react';

type useHeaderResult = {
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
};

export const useHeader = (): useHeaderResult => {
	const [isOpen, setIsOpen] = useState(false);
	const onClose = () => setIsOpen(false);
	const onOpen = () => setIsOpen(true);
	return {
		isOpen,
		onOpen,
		onClose,
	};
};
