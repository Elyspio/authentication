import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import { Provider } from "react-redux";
import store, { history, useAppSelector } from "./store";
import Application from "./view/components/Application";
import { CssBaseline, StyledEngineProvider, Theme, ThemeProvider } from "@mui/material";
import { themes } from "./config/theme";
import { Config } from "./config/window";
import "react-toastify/dist/ReactToastify.css";
import { ConnectedRouter } from "connected-react-router";


declare module "@mui/styles/defaultTheme" {
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	interface DefaultTheme extends Theme {
	}
}


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
			<ConnectedRouter history={history}>
				<Wrapper />
			</ConnectedRouter>
		</Provider>
	);
}

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
