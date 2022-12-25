import * as React from "react";
import "./Application.scss";
import { useAppDispatch, useAppSelector } from "../../store";
import { withDrawer } from "./utils/drawer/Drawer.hoc";
import { Box, Container } from "@mui/material";
import { DarkMode, LightMode } from "@mui/icons-material";
import { Route, Routes } from "react-router";
import { applicationPaths } from "../../config/routes";
import { Register } from "./register/Register";
import { Login } from "./login/Login";

function Application() {
	const dispatch = useAppDispatch();

	const { theme, themeIcon, logged } = useAppSelector((s) => ({
		theme: s.theme.current,
		themeIcon: s.theme.current === "dark" ? <LightMode /> : <DarkMode />,
		logged: s.authentication.logged,
	}));

	const actions = [];

	const drawer = withDrawer({
		component: (
			<Container maxWidth={"xl"}>
				<Routes>
					<Route path={applicationPaths.login} element={<Login />} />
					<Route path={applicationPaths.register} element={<Register />} />
				</Routes>
			</Container>
		),
		actions,
		title: "Authentication",
	});

	return (
		<Box className={"Application"} bgcolor={"background.default"}>
			{drawer}
		</Box>
	);
}

export default Application;
