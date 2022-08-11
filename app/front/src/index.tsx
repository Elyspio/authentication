import React from "react";
import "./index.scss";
import { Provider } from "react-redux";
import store, { history, useAppSelector } from "./store";
import Application from "./view/components/Application";
import { CssBaseline, StyledEngineProvider, ThemeProvider } from "@mui/material";
import { themes } from "./config/theme";
import { Config } from "./config/window";
import { HistoryRouter } from "redux-first-history/rr6";
import { createRoot } from "react-dom/client";

import "react-toastify/dist/ReactToastify.css";

declare global {
	interface Window {
		config: Config;
	}
}

function Wrapper() {
	const theme = useAppSelector((state) => (state.theme.current === "dark" ? themes.dark : themes.light));

	return (
		<StyledEngineProvider injectFirst>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<Application />
			</ThemeProvider>
		</StyledEngineProvider>
	);
}

function App() {
	return (
		<Provider store={store}>
			<HistoryRouter history={history} basename={"/authentication"}>
				<Wrapper />
			</HistoryRouter>
		</Provider>
	);
}

const root = createRoot(document.getElementById("root")!);

root.render(<App />);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
