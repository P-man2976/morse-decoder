import {
	audioLevelThresholdAtom,
	audioMaxDecibelsAtom,
	audioMaxFreqAtom,
	audioMinDecibelsAtom,
	audioMinFreqAtom,
} from "@/store/audio";
import { useAtom } from "jotai";
import { Button } from "./ui/button";
import { TbMinus, TbPlus } from "react-icons/tb";
import { Slider } from "./ui/slider";
import { morseWpmAtom } from "@/store/morse";

export function Settings() {
	const [maxDecibels, setMaxDecibels] = useAtom(audioMaxDecibelsAtom);
	const [minDecibels, setMinDecibels] = useAtom(audioMinDecibelsAtom);
	const [minFreq, setMinFreq] = useAtom(audioMinFreqAtom);
	const [maxFreq, setMaxFreq] = useAtom(audioMaxFreqAtom);
	const [threshold, setThreshold] = useAtom(audioLevelThresholdAtom);
	const [wpm, setWpm] = useAtom(morseWpmAtom);

	return (
		<div className="flex justify-center gap-4 max-md:flex-col md:flex-wrap">
			<div className="space-y-2">
				<h4 className="text-sm font-bold">最小音量</h4>
				<div className="flex items-center justify-between gap-4">
					<Button
						disabled={minDecibels === -100}
						size="icon"
						onClick={() => setMinDecibels((v) => Math.max(v - 1, -100))}
					>
						<TbMinus />
					</Button>
					<span>{minDecibels}dB</span>
					<Button
						disabled={minDecibels === maxDecibels - 1}
						size="icon"
						onClick={() =>
							setMinDecibels((v) => Math.min(v + 1, maxDecibels - 1))
						}
					>
						<TbPlus />
					</Button>
				</div>
				<Slider
					min={-100}
					max={maxDecibels - 1}
					value={[minDecibels]}
					onValueChange={([v]) => setMinDecibels(v)}
				/>
			</div>
			<div className="space-y-2">
				<h4 className="text-sm font-bold">最大音量</h4>
				<div className="flex items-center justify-between gap-4">
					<Button
						disabled={maxDecibels === minDecibels + 1}
						size="icon"
						onClick={() =>
							setMaxDecibels((v) => Math.max(v - 1, minDecibels + 1))
						}
					>
						<TbMinus />
					</Button>
					<span>{maxDecibels}dB</span>
					<Button
						disabled={maxDecibels === 0}
						size="icon"
						onClick={() => setMaxDecibels((v) => Math.min(v + 1, 0))}
					>
						<TbPlus />
					</Button>
				</div>
				<Slider
					min={minDecibels + 1}
					max={0}
					value={[maxDecibels]}
					onValueChange={([v]) => setMaxDecibels(v)}
				/>
			</div>
			<div className="space-y-2">
				<h4 className="text-sm font-bold">最小周波数</h4>
				<div className="flex items-center justify-between gap-4">
					<Button
						disabled={minFreq === 0}
						size="icon"
						onClick={() => setMinFreq((v) => Math.max(v - 10, 0))}
					>
						<TbMinus /> 10
					</Button>
					<span>{minFreq}Hz</span>
					<Button
						disabled={minFreq === maxFreq - 1}
						size="icon"
						onClick={() => setMinFreq((v) => Math.min(v + 10, maxFreq - 1))}
					>
						<TbPlus /> 10
					</Button>
				</div>
				<Slider
					min={0}
					max={maxFreq - 1}
					value={[minFreq]}
					onValueChange={([v]) => setMinFreq(v)}
				/>
			</div>
			<div className="space-y-2">
				<h4 className="text-sm font-bold">最大周波数</h4>
				<div className="flex items-center justify-between gap-4">
					<Button
						disabled={maxFreq === minFreq + 1}
						size="icon"
						onClick={() => setMaxFreq((v) => Math.max(v - 10, minFreq + 1))}
					>
						<TbMinus /> 10
					</Button>
					<span>{maxFreq}Hz</span>
					<Button
						disabled={maxFreq === 24000}
						size="icon"
						onClick={() => setMaxFreq((v) => Math.min(v + 10, 24000))}
					>
						<TbPlus /> 10
					</Button>
				</div>
				<Slider
					min={minFreq + 1}
					max={24000}
					value={[maxFreq]}
					onValueChange={([v]) => setMaxFreq(v)}
				/>
			</div>
			<div className="space-y-2">
				<h4 className="text-sm font-bold">閾値</h4>
				<div className="flex items-center justify-between gap-4">
					<Button
						disabled={threshold === 1}
						size="icon"
						onClick={() => setThreshold((v) => Math.max(v - 1, 1))}
					>
						<TbMinus />
					</Button>
					<span>{threshold}</span>
					<Button
						disabled={threshold === 255}
						size="icon"
						onClick={() => setThreshold((v) => Math.min(v + 1, 255))}
					>
						<TbPlus />
					</Button>
				</div>
				<Slider
					min={1}
					max={255}
					value={[threshold]}
					onValueChange={([v]) => setThreshold(v)}
				/>
			</div>
			<div className="space-y-2">
				<h4 className="text-sm font-bold">WPM</h4>
				<div className="flex items-center justify-between gap-4">
					<Button
						disabled={wpm === 1}
						size="icon"
						onClick={() => setWpm((v) => Math.max(v - 1, 1))}
					>
						<TbMinus />
					</Button>
					<span>{wpm}</span>
					<Button
						// disabled={threshold === 255}
						size="icon"
						onClick={() => setWpm((v) => Math.min(v + 1, Infinity))}
					>
						<TbPlus />
					</Button>
				</div>
				<Slider
					min={1}
					max={100}
					value={[wpm]}
					onValueChange={([v]) => setWpm(v)}
				/>
			</div>
		</div>
	);
}
