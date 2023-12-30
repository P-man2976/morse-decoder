import { useCallback, useEffect, useState } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
	TbPlayerPause,
	TbPlayerPlay,
	TbPlayerSkipBack,
	TbPlayerStop,
} from "react-icons/tb";
import {
	audioAnalyserNodeAtom,
	audioBufferAtom,
	audioBufferNodeAtom,
	audioContextAtom,
	audioFileAtom,
	audioIsPlayingAtom,
	audioPausePosAtom,
} from "@/store/audio";
import { Button } from "./ui/button";
import { useAtomCallback } from "jotai/utils";
import {
	morseArrayAtom,
	morseBlankArrayAtom,
	morseLastStateAtom,
	morseSignalArrayAtom,
} from "@/store/morse";

export function Control() {
	const audioContext = useAtomValue(audioContextAtom);
	const audioBuffer = useAtomValue(audioBufferAtom);
	const analyserNode = useAtomValue(audioAnalyserNodeAtom);
	const [audioFile, setAudioFile] = useAtom(audioFileAtom);
	const [bufferSource, refreshBufferSource] = useAtom(audioBufferNodeAtom);
	const [isPlaying, setIsPlaying] = useAtom(audioIsPlayingAtom);
	const [pausePos, setPausePos] = useAtom(audioPausePosAtom);

	const setMorseArray = useSetAtom(morseArrayAtom);
	const setMorseLastState = useSetAtom(morseLastStateAtom);
	const setSignalArray = useSetAtom(morseSignalArrayAtom);
	const setBlankArray = useSetAtom(morseBlankArrayAtom);

	const getBufferSource = useAtomCallback(
		useCallback((get) => get(audioBufferNodeAtom), []),
	);

	const [startTime, setStartTime] = useState(0);

	// biome-ignore lint/correctness/useExhaustiveDependencies: set* is not related to effects
	useEffect(() => {
		console.log(bufferSource);
		if (!audioBuffer || bufferSource.buffer) return;

		bufferSource.buffer = audioBuffer;
		bufferSource.connect(analyserNode);
		bufferSource.onended = () => {
			setMorseLastState(null);
			setSignalArray([]);
			setBlankArray([]);
		};
	}, [audioBuffer, analyserNode, bufferSource]);

	return (
		<div className="sticky top-0 z-10 flex w-full justify-center gap-2 bg-gray-1">
			<Button
				disabled={!audioFile}
				className="size-18 text-5xl"
				variant="ghost"
				onClick={() => {
					if (isPlaying) {
						bufferSource.stop();
						refreshBufferSource();
						getBufferSource().start();
					} else {
						audioContext.resume();
					}
					setPausePos(0);
					setStartTime(0);
					setMorseArray([]);
				}}
			>
				<TbPlayerSkipBack />
			</Button>
			<Button
				disabled={!audioFile}
				className="size-18 text-5xl"
				variant="ghost"
				onClick={() => {
					if (isPlaying) {
						bufferSource.stop();
						refreshBufferSource();
						setIsPlaying(false);
						setPausePos(audioContext.currentTime - startTime);
					} else {
						audioContext.resume();
						bufferSource.start(0, pausePos);
						setIsPlaying(true);
						setStartTime(audioContext.currentTime - pausePos);
					}
				}}
			>
				{isPlaying ? <TbPlayerPause /> : <TbPlayerPlay />}
			</Button>
			<Button
				disabled={!audioFile}
				className="size-18 text-5xl"
				variant="ghost"
				onClick={() => {
					if (isPlaying) {
						setIsPlaying(false);
						bufferSource.stop();
					}

					refreshBufferSource();
					setPausePos(0);
					setStartTime(0);
					setMorseArray([]);
					setAudioFile(null);
				}}
			>
				<TbPlayerStop />
			</Button>
		</div>
	);
}
