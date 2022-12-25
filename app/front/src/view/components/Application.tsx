import * as React from "react";
import { useEffect, useMemo } from "react";
import "./Application.scss";
import { useAppDispatch, useAppSelector } from "../../store";
import { createDrawerAction, ModalAction, withDrawer } from "./utils/drawer/Drawer.hoc";
import { Box, Container } from "@mui/material";
import { DarkMode, LightMode, Login as IconLogin, Logout, PersonAdd } from "@mui/icons-material";
import { Route, Routes } from "react-router";
import { applicationPaths } from "../../config/routes";
import { Register } from "./register/Register";
import { Login } from "./login/Login";
import { logout } from "../../store/module/authentication/authentication.async.action";
import { changeLocation } from "../../core/services/router.service";
import { initApp } from "../../store/common/common.actions";

function Application() {
	const dispatch = useAppDispatch();

	const { theme, themeIcon, logged, init } = useAppSelector((s) => ({
		theme: s.theme.current,
		themeIcon: s.theme.current === "dark" ? <LightMode /> : <DarkMode />,
		logged: !!s.authentication.user,
		init: s.authentication.init,
	}));

	const actions = useMemo(() => {
		const acts: ModalAction[] = [];

		if (logged) {
			acts.push(
				createDrawerAction("Logout", {
					icon: <Logout />,
					onClick: () => dispatch(logout()),
				})
			);
		} else {
			acts.push(
				createDrawerAction("Login", {
					icon: <IconLogin />,
					onClick: () => dispatch(changeLocation("login")),
				})
			);
		}

		if (logged || init) {
			acts.push(
				createDrawerAction("Register", {
					icon: <PersonAdd />,
					onClick: () => dispatch(changeLocation("register")),
				})
			);
		}

		return acts;
	}, [logged, dispatch]);

	useEffect(() => {
		dispatch(initApp());
	}, [dispatch]);

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
