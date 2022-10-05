import * as React from "react";
import { Box } from "@mui/material";
import "./Application.scss";
import Brightness5Icon from "@mui/icons-material/Brightness5";
import Brightness3Icon from "@mui/icons-material/Brightness3";
import BuildIcon from "@mui/icons-material/Build";
import Home from "@mui/icons-material/Home";
import AccountCircle from "@mui/icons-material/AccountCircle";
import AddCircle from "@mui/icons-material/AddCircle";
import Security from "@mui/icons-material/Security";
import { Route, Routes } from "react-router";
import { useAppDispatch, useAppSelector } from "../../store";
import { toggleTheme } from "../../store/module/theme/theme.action";
import { createDrawerAction, createDrawerDivider, withDrawer } from "./utils/drawer/Drawer.hoc";
import Login from "./account/Login";
import { toast, ToastContainer } from "react-toastify";
import { updateToastTheme } from "./utils/toast";
import { Services } from "../../core/services";
import { checkIfSomeUserExist, logout, verifyLogin } from "../../store/module/authentication/authentication.action";
import { SettingContainer } from "./settings/Settings";
import { CredentialContainer } from "./credentials/Credentials";
import { useAsyncEffect } from "../hooks/useAsyncEffect";
import { applicationPaths } from "../../config/routes";
import { ReactComponent as Logout } from "../icons/logout.svg";
import Register from "./account/register/Register";
import { AuthorizationsContainer } from "./authorizations/Authorizations";
import { AuthorizationAuthenticationModelRolesEnum } from "../../core/apis/backend";
import { Dashboard } from "./Dashboard";
import { changeLocation } from "../../core/services/router.service";

const isValid = async () => {
	let success = await Services.authentication.isValid();
	if (success) {
		toast.success("Authorized");
	} else {
		toast.error("Unauthorized");
	}
};

function AppDrawer() {
	const dispatch = useAppDispatch();

	const theme = useAppSelector((s) => s.theme.current);
	const isAdmin = useAppSelector((s) => s.authentication.authorizations?.authentication?.roles.includes(AuthorizationAuthenticationModelRolesEnum.Admin));
	const { logged: isLogged, canBypass } = useAppSelector((s) => s.authentication);
	const icon = theme === "dark" ? <Brightness5Icon /> : <Brightness3Icon />;
	const { pathname } = useAppSelector((s) => s.router.location!);

	React.useEffect(() => updateToastTheme(theme), [theme]);
	React.useEffect(() => {
		dispatch(checkIfSomeUserExist());
	}, [dispatch]);

	let actions = [
		createDrawerAction(theme === "dark" ? "Light Mode" : "Dark Mode", {
			icon,
			onClick: () => dispatch(toggleTheme()),
		}),
		createDrawerAction("Verify token", {
			onClick: isValid,
			icon: <BuildIcon />,
		}),
	];

	if (pathname !== applicationPaths.dashboard) {
		actions.push(
			createDrawerAction("Home", {
				onClick: () => dispatch(changeLocation(applicationPaths.dashboard)),
				icon: <Home />,
			}),
		);
	}

	if (isLogged) {
		actions.push(
			createDrawerAction("Logout", {
				onClick: () => dispatch(logout()),
				icon: <Logout fill={"currentColor"} />,
			}),
		);
		actions.push(createDrawerDivider("User"));

		if (pathname !== applicationPaths.settings) {
			actions.push(
				createDrawerAction("Settings", {
					onClick: () => dispatch(changeLocation(applicationPaths.settings)),
					icon: <SettingsIcon />,
				}),
			);
		}

		if (pathname !== applicationPaths.credentials) {
			actions.push(
				createDrawerAction("Credentials", {
					onClick: () => dispatch(changeLocation(applicationPaths.credentials)),
					icon: <AccountCircle />,
				}),
			);
		}
	} else {
		actions.push(
			createDrawerAction("Login", {
				onClick: () => dispatch(changeLocation(applicationPaths.login)),
				icon: <Logout fill={"currentColor"} />,
			}),
		);
	}

	if (isAdmin || canBypass) {
		actions.push(createDrawerDivider("Admin"));
		if (pathname !== applicationPaths.register) {
			actions.push(
				createDrawerAction("Register", {
					icon: <AddCircle />,
					onClick: () => dispatch(changeLocation(applicationPaths.register)),
				}),
			);
		}
		if (isLogged && pathname !== applicationPaths.authorizations) {
			actions.push(
				createDrawerAction("Authorizations", {
					onClick: () => dispatch(changeLocation(applicationPaths.authorizations)),
					icon: <Security />,
				}),
			);
		}
	}

	React.useEffect(() => {
		if (!isLogged) dispatch(changeLocation(applicationPaths.login));
	}, [dispatch, isLogged]);

	return withDrawer({
		component: (
			<Routes>
				<Route path={applicationPaths.dashboard} element={<Dashboard />} />
				<Route path={applicationPaths.login} element={<Login />} />
				<Route path={applicationPaths.settings} element={<SettingContainer />} />
				<Route path={applicationPaths.register} element={<Register />} />
				<Route path={applicationPaths.credentials} element={<CredentialContainer />} />
				<Route path={applicationPaths.authorizations} element={<AuthorizationsContainer />} />
			</Routes>
		),
		actions: actions,
		title: "Authentication",
	});
}

function Application() {
	const theme = useAppSelector((s) => s.theme.current);

	const dispatch = useAppDispatch();

	useAsyncEffect(async () => {
		await dispatch(verifyLogin());
	}, [dispatch]);

	return (
		<Box className={"Application"} bgcolor={"background.default"}>
			<ToastContainer position={"top-left"} theme={theme} />
			<AppDrawer />
		</Box>
	);
}

export default Application;
