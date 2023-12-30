export function sum(arr: number[]) {
	let v = 0;

	for (const element of arr) {
		v += element;
	}

	return v;
}

export function avg(arr: number[]) {
	return sum(arr) / arr.length;
}
