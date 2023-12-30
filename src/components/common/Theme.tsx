import { darkModeAtom } from "@/store/theme";
import { useAtomValue } from "jotai";
import { ReactNode, useEffect } from "react";

export function ThemeProvider({ children }: { children: ReactNode }) {
	const darkMode = useAtomValue(darkModeAtom);

	useEffect(() => {
		if (darkMode) document.documentElement.classList.add("dark");
		else document.documentElement.classList.remove("dark");
	}, [darkMode]);

	return children;
}
