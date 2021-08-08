import React from 'react';
import './Login.scss'
import {Button, CircularProgress, Paper, TextField, Typography} from "@material-ui/core";
import {useAsyncCallback} from "../../hooks/useAsyncCallback";
import {useAppDispatch} from "../../../store";
import {login} from "../../../store/module/authentication/authentication.action";


function Login() {

	const [password, setPassword] = React.useState("")
	const [name, setName] = React.useState("")
	const dispatch = useAppDispatch();
	const [submit, {isExecuting}] = useAsyncCallback(async () => {

		await dispatch(login({password, name}))
		setPassword("");
	}, [ name, password])


	return (
		<Paper className={"Login"} onKeyDown={e => e.key === "Enter" && submit()}>

			<Typography variant={"h6"} align={"center"}>Your information</Typography>

			<TextField
				id={"login-name"}
				label="Name"
				variant={"standard"}
				value={name}
				onChange={e => setName(e.target.value)}/>

			<TextField
				id={"login-password"}
				label="Password"
				value={password}
				type={"password"}
				variant={"standard"}
				onChange={e => setPassword(e.target.value)}/>

			<Button
				disabled={name.length === 0 || password.length === 0}
				color={"primary"}
				type={"submit"}
				variant={"outlined"}
				onClick={submit}>
				{isExecuting ? <CircularProgress/> : "Submit"}
			</Button>
		</Paper>
	);
}

export default Login;
