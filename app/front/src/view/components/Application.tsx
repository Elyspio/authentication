import * as React from "react";
import { useEffect, useMemo } from "react";
import "./Application.scss";
import { useAppDispatch, useAppSelector } from "@store";
import { createDrawerAction, withDrawer } from "./utils/drawer/Drawer.hoc";
import { Box, Container } from "@mui/material";
import { DarkMode, Dashboard, LightMode, Login, Logout, PersonAdd } from "@mui/icons-material";
import { Route, Routes } from "react-router";
import { applicationPaths } from "@/config/routes";
import { Register } from "./auth/Register";
import { Login as LoginComponent } from "./auth/Login";
import { logout } from "@modules/authentication/authentication.async.action";
import { changeLocation } from "@services/router.service";
import { initApp } from "@store/modules/workflows/workflows.async.actions";
import { toggleTheme } from "@modules/theme/theme.action";
import { Dashboard as DashboardComponent } from "./users/dashboard/Dashboard";
import { usePermissions } from "@hooks/usePermissions";
import { UserDetail } from "./users/detail/UserDetail";

function Application() {
	const dispatch = useAppDispatch();

	const { theme, themeIcon, logged, init, route } = useAppSelector((s) => ({
		theme: s.theme.current,
		themeIcon: s.theme.current === "dark" ? <LightMode /> : <DarkMode />,
		logged: !!s.authentication.user,
		init: s.authentication.init,
		route: s.router.location,
	}));

	const { isAdmin } = usePermissions();

	const actions = useMemo(() => {
		const elems = [
			createDrawerAction(theme === "light" ? "Dark Mode" : "Light Mode", {
				icon: themeIcon,
				onClick: () => dispatch(toggleTheme()),
			}),
		];

		if (logged) {
			elems.push(
				createDrawerAction("Logout", {
					icon: <Logout />,
					onClick: () => dispatch(logout()),
				})
			);

			if (!route?.pathname.endsWith(applicationPaths.dashboard)) {
				elems.push(
					createDrawerAction("Dashboard", {
						icon: <Dashboard />,
						onClick: () => dispatch(changeLocation("dashboard")),
					})
				);
			}
		} else {
			if (!route?.pathname.endsWith(applicationPaths.login)) {
				elems.push(
					createDrawerAction("Login", {
						icon: <Login />,
						onClick: () => dispatch(changeLocation("login")),
					})
				);
			}
		}

		if ((isAdmin || init) && !route?.pathname.endsWith(applicationPaths.register)) {
			elems.push(
				createDrawerAction("Register", {
					icon: <PersonAdd />,
					onClick: () => dispatch(changeLocation("register")),
				})
			);
		}

		return elems;
	}, [logged, isAdmin, dispatch, theme, themeIcon, init, route]);

	useEffect(() => {
		dispatch(initApp());
	}, [dispatch]);

	const drawer = withDrawer({
		component: (
			<Container maxWidth={"xl"} className={"Container"}>
				<Routes>
					<Route path={applicationPaths.login} element={<LoginComponent />} />
					<Route path={"users/:id"} element={<UserDetail />} />
					<Route path={applicationPaths.register} element={<Register />} />
					<Route path={applicationPaths.dashboard} element={<DashboardComponent />} />
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
