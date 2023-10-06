import { useEffect, useRef } from 'react';

export const getNumbersArray = (count: number) => Array.from(Array(count).keys());

export const getDeepClone = <T>(data: T): T => JSON.parse(JSON.stringify(data));

export const isEven = (num: number) => num % 2 === 0;

export function usePrevious<T>(value: T): T {
	const ref = useRef<T | undefined>(undefined);

	useEffect(() => {
		ref.current = value;
	}, [value]);

	return ref.current!;
}
