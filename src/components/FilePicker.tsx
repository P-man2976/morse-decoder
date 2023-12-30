import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { useAtom, useSetAtom } from "jotai";
import {
	audioBufferNodeAtom,
	audioFileAtom,
	audioIsPlayingAtom,
	audioPausePosAtom,
} from "@/store/audio";

export function FilePicker() {
	const [audioFile, setAudioFile] = useAtom(audioFileAtom);
	const setIsPlaying = useSetAtom(audioIsPlayingAtom);
	const setPausePos = useSetAtom(audioPausePosAtom);
	const refreshBufferSource = useSetAtom(audioBufferNodeAtom);
	const ref = useRef<HTMLInputElement>(null);

	return (
		<div className="flex w-full flex-col items-center gap-4">
			<Button size="lg" onClick={() => ref.current?.click()}>
				ファイルを選択
			</Button>
			<input
				hidden
				type="file"
				ref={ref}
				onChange={(e) => {
					const file = e.target.files?.[0];

					if (!file) return;
					setIsPlaying(false);
					refreshBufferSource();
					setAudioFile(file);
					setPausePos(0);
				}}
			/>
			<span className="break-all font-bold">
				{audioFile?.name ?? "ファイルを選択してください"}
			</span>
		</div>
	);
}
