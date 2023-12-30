import { morseCode } from "@/lib/morse";
import { morseArrayAtom } from "@/store/morse";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";

export function DecodedText() {
	const [decoded, setDecoded] = useState("");
	const morseArray = useAtomValue(morseArrayAtom);
	// const setMorseWpm = useSetAtom(morseWpmAtom);

	useEffect(() => {
		const morseStr = morseArray.map(({ char }) => char).join("");
		const morseStrArray = morseStr.split(" ");
		// if (morseStr.at(-1) === " ")
		setDecoded(
			morseStrArray
				.map(
					(code) =>
						Object.entries(morseCode).find(
							([, value]) => value === code,
						)?.[0] ?? "#",
				)
				.join(""),
		);

		if (!morseStr) setDecoded("");

		// const lastCode = morseStrArray.at(-1)!;
		// if (morseStrArray.length >= 2 && lastCode) {
		//   const lastCodeArray = morseArray.slice(
		//     morseArray.length - lastCode.length - 1,
		//   );
		//   console.log(lastCodeArray);
		//   const charTime =
		//     (lastCodeArray.at(-1)?.time ?? 0) - lastCodeArray[0].time;
		//   const codeUnitCount =
		//     sum(
		//       lastCodeArray.map(({ char }) =>
		//         char === "." ? 1 : char === "-" ? 3 : 0,
		//       ),
		//     ) + 7;

		//   setMorseWpm((codeUnitCount * ((60 * 1000) / charTime)) / 50);
		// }
	}, [morseArray]);

	return (
		<div className="flex min-h-[8lh] w-full flex-col overflow-hidden rounded-lg bg-gray-2">
			<div className="grow">
				<div className="w-full bg-gray-3 px-4 py-2 font-bold">
					モールス符号文字列
				</div>
				<div className="max-h-36 w-full overflow-y-auto break-all px-4 py-2 font-mono">
					{morseArray.map(({ char }) => char).join("") ?? ""}
				</div>
			</div>
			<div className="grow">
				<div className="w-full bg-gray-3 px-4 py-2 font-bold">解読文字列</div>
				<div className="max-h-36 w-full overflow-y-auto break-all px-4 py-2 font-mono">
					{decoded}
				</div>
			</div>
		</div>
	);
}
