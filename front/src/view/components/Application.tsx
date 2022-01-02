import * as React from "react";
import { Box } from "@material-ui/core";
import "./Application.scss";
import Brightness5Icon from "@material-ui/icons/Brightness5";
import Brightness3Icon from "@material-ui/icons/Brightness3";
import BuildIcon from "@material-ui/icons/Build";
import { Route, Switch as SwitchRouter } from "react-router";
import { useAppDispatch, useAppSelector } from "../../store";
import { toggleTheme } from "../../store/module/theme/theme.action";
import { createDrawerAction, createDrawerDivider, withDrawer } from "./utils/drawer/Drawer.hoc";
import Login from "./account/Login";
import { toast, ToastContainer } from "react-toastify";
import { updateToastTheme } from "./utils/toast";
import { Services } from "../../core/services";
import { checkIfSomeUserExist, logout, verifyLogin } from "../../store/module/authentication/authentication.action";
import { AccountCircle, AddCircle, Home, Security, Settings as SettingsIcon } from "@material-ui/icons";
import { push } from "connected-react-router";
import { SettingContainer } from "./settings/Settings";
import { CredentialContainer } from "./credentials/Credentials";
import { useAsyncEffect } from "../hooks/useAsyncEffect";
import { applicationPaths } from "../../config/routes";
import { ReactComponent as Logout } from "../icons/logout.svg";
import Register from "./account/register/Register";
import { AuthorizationsContainer } from "./authorizations/Authorizations";
import { AuthorizationAuthenticationModelRolesEnum } from "../../core/apis/backend";
import { Dashboard } from "./Dashboard";
import { useDispatch } from "react-redux";

const isValid = async () => {
	let success = await Services.authentication.isValid();
	if (success) {
		toast.success("Authorized");
	} else {
		toast.error("Unauthorized");
	}
};

function AppDrawer() {
	const dispatch = useDispatch();

	const theme = useAppSelector((s) => s.theme.current);
	const isAdmin = useAppSelector((s) => s.authentication.authorizations?.authentication?.roles.includes(AuthorizationAuthenticationModelRolesEnum.Admin));
	const { logged: isLogged, canBypass } = useAppSelector((s) => s.authentication);
	const icon = theme === "dark" ? <Brightness5Icon /> : <Brightness3Icon />;
	const { pathname } = useAppSelector((s) => s.router.location);

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
				onClick: () => dispatch(push(applicationPaths.dashboard)),
				icon: <Home />,
			})
		);
	}

	if (isLogged) {
		actions.push(
			createDrawerAction("Logout", {
				onClick: () => dispatch(logout()),
				icon: <Logout fill={"currentColor"} />,
			})
		);
		actions.push(createDrawerDivider("User"));

		if (pathname !== applicationPaths.settings) {
			actions.push(
				createDrawerAction("Settings", {
					onClick: () => dispatch(push(applicationPaths.settings)),
					icon: <SettingsIcon />,
				})
			);
		}

		if (pathname !== applicationPaths.credentials) {
			actions.push(
				createDrawerAction("Credentials", {
					onClick: () => dispatch(push(applicationPaths.credentials)),
					icon: <AccountCircle />,
				})
			);
		}
	} else {
		actions.push(
			createDrawerAction("Login", {
				onClick: () => dispatch(push(applicationPaths.login)),
				icon: <Logout fill={"currentColor"} />,
			})
		);
	}

	if (isAdmin || canBypass) {
		actions.push(createDrawerDivider("Admin"));
		if (pathname !== applicationPaths.register) {
			actions.push(
				createDrawerAction("Register", {
					icon: <AddCircle />,
					onClick: () => dispatch(push(applicationPaths.register)),
				})
			);
		}
		if (isLogged && pathname !== applicationPaths.authorizations) {
			actions.push(
				createDrawerAction("Authorizations", {
					onClick: () => dispatch(push(applicationPaths.authorizations)),
					icon: <Security />,
				})
			);
		}
	}

	React.useEffect(() => {
		if (!isLogged) dispatch(push(applicationPaths.login));
	}, [dispatch, isLogged]);

	return withDrawer({
		component: (
			<SwitchRouter>
				<Route exact path={applicationPaths.dashboard} component={Dashboard} />
				<Route exact path={applicationPaths.login} component={Login} />
				<Route exact path={applicationPaths.settings} component={SettingContainer} />
				<Route exact path={applicationPaths.register} component={Register} />
				<Route exact path={applicationPaths.credentials} component={CredentialContainer} />
				<Route exact path={applicationPaths.authorizations} component={AuthorizationsContainer} />
			</SwitchRouter>
		),
		actions: actions,
		title: "Authentication",
	});
}

function Application() {
	const dispatch = useAppDispatch();

	useAsyncEffect(async () => {
		await dispatch(verifyLogin());
	}, [dispatch]);

	return (
		<Box className={"Application"} bgcolor={"background.default"}>
			<ToastContainer position={"top-left"} />
			<AppDrawer />
		</Box>
	);
}

export default Application;
