import { FilePicker } from "./components/FilePicker";
import { Visualizer } from "./components/Visualizer";
import { Control } from "./components/Control";
import { Suspense } from "react";
import { Settings } from "./components/Settings";
import { DecodedText } from "./components/DecodedText";
import { Button } from "./components/ui/button";
import { useAtom } from "jotai";
import { darkModeAtom } from "./store/theme";
import { TbMoon, TbSun } from "react-icons/tb";

function App() {
	const [darkMode, setDarkMode] = useAtom(darkModeAtom);

	return (
		<div className="mx-auto flex min-h-dvh w-full max-w-screen-lg flex-col gap-8 p-8 lg:px-0">
			<Button
				variant="ghost"
				className="fixed right-4 top-4 z-20 text-lg"
				size="icon"
				onClick={() => setDarkMode((v) => !v)}
			>
				{darkMode ? <TbSun /> : <TbMoon />}
			</Button>
			<FilePicker />
			<Suspense>
				<Control />
			</Suspense>
			<Settings />
			<DecodedText />
			<Visualizer />
		</div>
	);
}

export default App;
