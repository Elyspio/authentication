import * as React from 'react';
import {Box} from "@material-ui/core";
import "./Application.scss"
import Brightness5Icon from '@material-ui/icons/Brightness5';
import Brightness3Icon from '@material-ui/icons/Brightness3';
import BuildIcon from '@material-ui/icons/Build';
import {useAppDispatch, useAppSelector} from "../../store";
import {toggleTheme} from "../../store/module/theme/action";
import {withDrawer} from "./utils/drawer/Drawer.hoc";
import Login from "./account/Login";
import {toast, ToastContainer} from "react-toastify";
import {updateToastTheme} from "./utils/toast";
import {createDrawerAction} from "./utils/drawer/actions/Action";
import {Services} from "../../core/services";


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

	const drawer = withDrawer({
		component: <Login onAuthorized={forward}/>,
		actions: [
			createDrawerAction(theme === "dark" ? "Light Mode" : "Dark Mode", {
				icon,
				onClick: () => dispatch(toggleTheme()),
			}),
			createDrawerAction("Verify token", {
				onClick: isValid,
				icon: <BuildIcon/>
			})
		],
		title: "Login page"
	})

	return (
		<Box className={"Application"} bgcolor={"background.default"}>
			<ToastContainer/>
			{drawer}
		</Box>
	);
}


export default Application
