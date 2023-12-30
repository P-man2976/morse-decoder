import { FallbackProps } from "react-error-boundary";
import { Button } from "../ui/button";

export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
	return (
		<div className="fixed inset-0 flex flex-col items-center justify-center gap-4 p-8">
			<pre className="bg-gray-4 px-2">{error.name}</pre>
			<pre className="max-w-full overflow-x-auto bg-gray-4 p-2 text-sm">
				{error.stack}
			</pre>
			<Button onClick={resetErrorBoundary}>Reset</Button>
		</div>
	);
}
