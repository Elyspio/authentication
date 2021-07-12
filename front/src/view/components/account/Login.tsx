import React from 'react';
import './Login.scss'
import {Button, CircularProgress, Paper, TextField, Typography} from "@material-ui/core";
import {Services} from "../../../core/services";
import {toast} from "react-toastify";
import {useAsyncCallback} from "../../hooks/useAsyncCallback";

interface Props {
	onAuthorized?: Function,
	onForbidden?: Function,
}


function Login(props: Props) {

	const [password, setPassword] = React.useState("")
	const [name, setName] = React.useState("")

	const [submit, {isExecuting}] = useAsyncCallback(async () => {

		let authorisation = await Services.authentication.isAuthorized({name, password});
		if (authorisation.success && authorisation.token) {

			if (props.onAuthorized) {
				props.onAuthorized();
			}

			toast.success("Ok")

		} else {
			toast.error("Vous n'êtes pas autorisé à faire cette action")

			if (props.onForbidden) {
				props.onForbidden();
			}
		}

		setPassword("")
		// setName("")
	}, [props.onForbidden, props.onAuthorized, name, password])


	return (
		<Paper elevation={2} className={"Login"} onKeyDown={e => e.key === "Enter" && submit()}>

			<Typography variant={"h6"}>Login</Typography>

			<TextField
				id={"login-name"}
				label="Name"
				value={name}
				onChange={e => setName(e.target.value)}/>

			<TextField
				id={"login-password"}
				label="Password"
				value={password}
				type={"password"}
				onChange={e => setPassword(e.target.value)}/>

			<Button
				disabled={name.length === 0 || password.length === 0}
				color={"primary"}
				type={"submit"}
				onClick={submit}>
				{isExecuting ? <CircularProgress/> : "Submit"}
			</Button>

		</Paper>
	);
}

export default Login;
