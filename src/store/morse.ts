import { avg } from "@/lib/math";
import { atom } from "jotai";

interface MorseSignal {
	type: "signal" | "blank";
	time: number;
	char: "-" | "." | " " | "";
}

export const morseArrayAtom = atom<MorseSignal[]>([]);
export const morseLastStateAtom = atom<Omit<MorseSignal, "char"> | null>(null);
export const morseSignalArrayAtom = atom<number[]>([]);
export const morseBlankArrayAtom = atom<number[]>([]);

export const morseDotDurationAtom = atom((get) => {
	const dots = get(morseSignalArrayAtom).filter(
		(duration) => duration <= get(morseDotDashThresholdAtom),
	);

	return avg(dots);
});

export const morseDashDurationAtom = atom((get) => {
	const dashes = get(morseSignalArrayAtom).filter(
		(duration) => duration > get(morseDotDashThresholdAtom),
	);

	return avg(dashes);
});

export const morseCharBlankDurationAtom = atom((get) => {
	const charBlanks = get(morseBlankArrayAtom).filter(
		(duration) => duration > get(morseCharBlankThresholdAtom),
	);

	return avg(charBlanks);
});

export const morseDotSpeedAtom = atom(
	(get) => (60 / (50 * get(morseWpmAtom))) * 1000,
);

export const morseDotDashThresholdAtom = atom(
	(get) => get(morseDotSpeedAtom) * 2,
);

export const morseCharBlankThresholdAtom = atom(
	(get) => get(morseDotSpeedAtom) * 2,
);

export const morseWpmAtom = atom(20);

export const morseDecodedTextAtom = atom("");
