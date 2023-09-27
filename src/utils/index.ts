export const getNumbersArray = (count: number) => Array.from(Array(count).keys());

export const getDeepClone = <T>(data: T): T => JSON.parse(JSON.stringify(data));

export const isEven = (num: number) => num % 2 === 0;

