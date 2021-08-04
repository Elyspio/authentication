import * as React from 'react';
import {Box} from "@material-ui/core";
import "./Application.scss"
import Brightness5Icon from '@material-ui/icons/Brightness5';
import Brightness3Icon from '@material-ui/icons/Brightness3';
import BuildIcon from '@material-ui/icons/Build';
import Logout from '@material-ui/icons/Logout';

import {useAppDispatch, useAppSelector} from "../../store";
import {toggleTheme} from "../../store/module/theme/theme.action";
import {createDrawerAction, withDrawer} from "./utils/drawer/Drawer.hoc";
import Login from "./account/Login";
import {toast, ToastContainer} from "react-toastify";
import {updateToastTheme} from "./utils/toast";
import {Services} from "../../core/services";
import {logout} from "../../store/module/authentication/authentication.action";


const isValid = async () => {
	let success = await Services.authentication.isValid();
	if (success) {
		toast.success("Authorized")

	} else {
		toast.error("Unauthorized")
	}
}


function Application() {

	const dispatch = useAppDispatch();

	const theme = useAppSelector(s => s.theme.current)
	const isLogged = useAppSelector(s => s.authentication.logged)
	const icon = theme === "dark" ? <Brightness5Icon/> : <Brightness3Icon/>;


	React.useEffect(() => updateToastTheme(theme), [theme])

	const forward = React.useCallback(() => {
		const url = new URL(window.location.href);
		const params = new URLSearchParams(url.search);
		const target = params.get("target");
		if (target) {
			window.location.href = target;
		}
	}, [])

	let actions = [
		createDrawerAction(theme === "dark" ? "Light Mode" : "Dark Mode", {
			icon,
			onClick: () => dispatch(toggleTheme()),
		}),
		createDrawerAction("Verify token", {
			onClick: isValid,
			icon: <BuildIcon/>
		})
	];


	if (isLogged) {
		actions.push(
			createDrawerAction("Logout", {
				onClick: () => dispatch(logout()),
				icon: <Logout/>
			})
		)
	}


	const drawer = withDrawer({
		component: <Login onAuthorized={forward}/>,
		actions: actions,
		title: "Login page"
	})


	return (
		<Box className={"Application"} bgcolor={"background.default"}>
			<ToastContainer position={"top-left"}/>
			{drawer}
		</Box>
	);
}


export default Application
