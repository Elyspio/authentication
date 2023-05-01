import "reflect-metadata";
import React from "react";
import { createRoot } from "react-dom/client";
import "./index.scss";
import { Provider } from "react-redux";
import store, { history, useAppSelector } from "@store";
import Application from "./view/components/Application";
import { StyledEngineProvider, Theme } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { themes } from "./config/theme";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { Provider as DiProvider } from "inversify-react";
import { container } from "@/core/di";
import { HistoryRouter } from "redux-first-history/rr6";

declare module "@mui/styles/defaultTheme" {
	interface DefaultTheme extends Theme {}
}

function Wrapper() {
	const { theme, current } = useAppSelector((state) => ({
		theme: state.theme.current === "dark" ? themes.dark : themes.light,
		current: state.theme.current,
	}));

	return (
		<StyledEngineProvider injectFirst>
			<ThemeProvider theme={theme}>
				<Application />
				<ToastContainer
					theme={current}
					position={"top-right"}
					limit={5}
					toastStyle={{
						right: 40,
						top: 48,
						backgroundColor: theme.palette.background.default,
						border: `1px solid ${theme.palette.divider}`,
					}}
				/>
			</ThemeProvider>
		</StyledEngineProvider>
	);
}

function App() {
	return (
		<DiProvider container={container}>
			<Provider store={store}>
				<HistoryRouter history={history} basename={"/authentication"}>
					<Wrapper />
				</HistoryRouter>
			</Provider>
		</DiProvider>
	);
}

createRoot(document.getElementById("root")!).render(<App />);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
