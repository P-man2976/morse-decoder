import React from "react";
import ReactDOM from "react-dom/client";
import { DevTools } from "jotai-devtools";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider } from "./components/common/Theme.tsx";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "./components/common/ErrorFallback.tsx";

// biome-ignore lint/style/noNonNullAssertion:
ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<ErrorBoundary FallbackComponent={ErrorFallback}>
			<ThemeProvider>
				<DevTools />
				<App />
			</ThemeProvider>
		</ErrorBoundary>
	</React.StrictMode>,
);
