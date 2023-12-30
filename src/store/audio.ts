import { atomWithRefresh } from "@/lib/atomWithRefresh";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const audioContextAtom = atom(new AudioContext());
export const audioFileAtom = atom<File | null>(null);

const audioArrayBufferAtom = atom((get) => get(audioFileAtom)?.arrayBuffer());
export const audioBufferAtom = atom(async (get) => {
	const arrayBuffer = await get(audioArrayBufferAtom);
	return arrayBuffer
		? get(audioContextAtom).decodeAudioData(arrayBuffer)
		: undefined;
});

// Audio node
export const audioAnalyserNodeAtom = atomWithRefresh(
	(get) => new AnalyserNode(get(audioContextAtom)),
);
export const audioBufferNodeAtom = atomWithRefresh(
	(get) => new AudioBufferSourceNode(get(audioContextAtom)),
);

// Audio state
export const audioIsPlayingAtom = atom(false);
export const audioPausePosAtom = atom(0);
export const audioMaxDecibelsAtom = atomWithStorage("maxDecibels", -30);
export const audioMinDecibelsAtom = atomWithStorage("minDecibels", -100);
export const audioLevelThresholdAtom = atomWithStorage("levelThreshold", 200);

export const audioMaxFreqAtom = atomWithStorage("maxFreq", 24000);
export const audioMinFreqAtom = atomWithStorage("minFreq", 0);
