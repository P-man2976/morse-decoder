import { useCallback, useEffect, useRef } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import {
	audioAnalyserNodeAtom,
	audioContextAtom,
	audioLevelThresholdAtom,
	audioMaxDecibelsAtom,
	audioMaxFreqAtom,
	audioMinDecibelsAtom,
	audioMinFreqAtom,
} from "@/store/audio";
import { useAtomCallback } from "jotai/utils";
import {
	morseLastStateAtom,
	morseBlankArrayAtom,
	morseSignalArrayAtom,
	morseArrayAtom,
	morseCharBlankThresholdAtom,
	morseDotDashThresholdAtom,
} from "@/store/morse";

const FOOTER_HEIGHT = 40;
const SIDEBAR_WIDTH = 80;

export function Visualizer() {
	const animationFrameRef = useRef<number | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const audioContext = useAtomValue(audioContextAtom);
	const analyserNode = useAtomValue(audioAnalyserNodeAtom);

	const setMorseArray = useSetAtom(morseArrayAtom);
	const setMorseLastState = useSetAtom(morseLastStateAtom);
	const setSignalArray = useSetAtom(morseSignalArrayAtom);
	const setBlankArray = useSetAtom(morseBlankArrayAtom);

	const getMorseBlankThreshold = useAtomCallback(
		useCallback((get) => get(morseCharBlankThresholdAtom), []),
	);
	const getMorseDotDashThreshold = useAtomCallback(
		useCallback((get) => get(morseDotDashThresholdAtom), []),
	);

	const getMorseLastState = useAtomCallback(
		useCallback((get) => get(morseLastStateAtom), []),
	);

	const getMaxDecibels = useAtomCallback(
		useCallback((get) => get(audioMaxDecibelsAtom), []),
	);
	const getMinDecibels = useAtomCallback(
		useCallback((get) => get(audioMinDecibelsAtom), []),
	);
	const getMinFreq = useAtomCallback(
		useCallback((get) => get(audioMinFreqAtom), []),
	);
	const getMaxFreq = useAtomCallback(
		useCallback((get) => get(audioMaxFreqAtom), []),
	);
	const getLevelThreshold = useAtomCallback(
		useCallback((get) => get(audioLevelThresholdAtom), []),
	);

	function draw() {
		animationFrameRef.current = requestAnimationFrame(draw);
		const canvasCtx = canvasRef.current?.getContext("2d", {
			willReadFrequently: true,
		});
		if (!canvasCtx) return;
		const { width, height } = canvasCtx.canvas;

		const levelThreshold = getLevelThreshold();
		const visualiserWidth = width - SIDEBAR_WIDTH;
		const visualiserHeight = height - FOOTER_HEIGHT;

		// Set parameters
		analyserNode.fftSize = 8192;
		analyserNode.smoothingTimeConstant = 0;
		analyserNode.maxDecibels = getMaxDecibels();
		analyserNode.minDecibels = getMinDecibels();

		// Draw previous image
		const prevImage = canvasCtx.getImageData(0, 0, visualiserWidth, height);
		canvasCtx.clearRect(0, 0, width, height);
		canvasCtx.putImageData(prevImage, -2, 0);

		// Draw border every 5 secs
		// if (audioContext.currentTime % 5 < 0.05) {
		//   canvasCtx.fillStyle = "rgb(255, 255, 255)";
		//   canvasCtx.fillRect(width - 1, 0, 2, height);
		// }
		const freqArray = new Uint8Array(analyserNode.frequencyBinCount);
		analyserNode.getByteFrequencyData(freqArray);

		const windowSize = freqArray.length / (audioContext.sampleRate / 2);
		const minFreqIndex = Math.ceil(windowSize * getMinFreq());
		const maxFreqIndex = Math.ceil(windowSize * getMaxFreq());

		// Draw sidebar
		canvasCtx.fillStyle = "#fff";
		canvasCtx.font = "16px monospace";
		canvasCtx.textBaseline = "top";
		canvasCtx.fillText(`${getMaxFreq()}Hz`, visualiserWidth + 10, 10);
		canvasCtx.textBaseline = "bottom";
		canvasCtx.fillText(
			`${getMinFreq()}Hz`,
			visualiserWidth + 10,
			visualiserHeight - 10,
		);

		// Draw spectram
		// biome-ignore lint/complexity/noForEach: forEach is better in terms of performance
		freqArray
			.slice(minFreqIndex, maxFreqIndex)
			.reverse()
			.forEach((freq, index, arr) => {
				// Draw border
				if (!(Math.ceil(windowSize * index) % 100)) {
					canvasCtx.fillStyle = "#ffffff22";
					canvasCtx.fillRect(
						visualiserWidth - 1,
						(visualiserHeight / arr.length / 2) * (index * 2 + 1),
						1,
						Math.min(visualiserHeight / arr.length, 1),
					);
				}

				canvasCtx.fillStyle =
					freq >= levelThreshold
						? `rgba(255, 0, 0, ${freq / 255})`
						: `rgba(0, 255, 0, ${freq / 255})`;
				canvasCtx.fillRect(
					visualiserWidth - 2,
					(visualiserHeight / arr.length) * index,
					2,
					visualiserHeight / arr.length,
				);
			});

		// Draw marker bar & Set start
		if (
			freqArray
				.slice(minFreqIndex, maxFreqIndex)
				.some((freq) => freq >= levelThreshold)
		) {
			canvasCtx.fillStyle = "rgb(255, 0, 0)";
			canvasCtx.fillRect(
				visualiserWidth - 2,
				visualiserHeight + 10,
				2,
				FOOTER_HEIGHT - 20,
			);

			// Draw marker
			canvasCtx.beginPath();
			canvasCtx.arc(
				visualiserWidth + SIDEBAR_WIDTH / 2,
				visualiserHeight + FOOTER_HEIGHT / 2,
				12,
				0,
				360,
			);
			canvasCtx.closePath();
			canvasCtx.fill();

			const lastState = getMorseLastState();

			// Set morse array
			if (lastState?.type === "blank" || !lastState) {
				const time = performance.now();
				setMorseLastState({
					type: "signal",
					time,
				});
				if (lastState) {
					const blankTime = time - lastState.time;
					setBlankArray((prev) => [...prev, time - lastState.time]);
					setMorseArray((prev) => [
						...prev,
						{
							type: "blank",
							time: time - lastState.time,
							char: blankTime < getMorseBlankThreshold() ? "" : " ",
						},
					]);
				}
			}
		} else {
			const lastState = getMorseLastState();
			if (lastState?.type === "signal") {
				const time = performance.now();
				const signalTime = time - lastState.time;
				setMorseLastState({
					type: "blank",
					time,
				});
				setSignalArray((prev) => [...prev, signalTime]);
				setMorseArray((prev) => [
					...prev,
					{
						type: "signal",
						time: time - lastState.time,
						char: signalTime < getMorseDotDashThreshold() ? "." : "-",
					},
				]);
			}
		}
	}

	useEffect(() => {
		draw();

		if (canvasRef.current && containerRef.current) {
			const dpr = window.devicePixelRatio;

			canvasRef.current.width = containerRef.current.clientWidth * dpr;
			canvasRef.current.height = containerRef.current.clientHeight * dpr;

			canvasRef.current.getContext("2d")?.scale(dpr, dpr);
		}

		return () => {
			// if (canvasRef.current) {
			//   canvasRef.current.width = 0;
			//   canvasRef.current.height = 0;
			//   canvasRef.current.remove();
			// }
			if (animationFrameRef.current)
				cancelAnimationFrame(animationFrameRef.current);
		};
	}, []);

	useEffect(() => {
		analyserNode.connect(audioContext.destination);
	}, [analyserNode, audioContext]);

	return (
		<div
			className="h-48 w-full shrink-0 overflow-hidden rounded-lg bg-gray-2 md:h-full md:grow"
			ref={containerRef}
		>
			<canvas
				width={containerRef.current?.clientWidth}
				height={containerRef.current?.clientHeight}
				ref={canvasRef}
			/>
		</div>
	);
}
