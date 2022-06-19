import React from "react";
import "./Login.scss";
import { Button, CircularProgress, Grid, Paper, TextField } from "@mui/material";
import { useAsyncCallback } from "../../hooks/useAsyncCallback";
import { login } from "../../../store/module/authentication/authentication.action";
import { Title } from "../utils/title";
import Divider from "@mui/material/Divider";
import { useAppDispatch } from "../../../store";

function Login() {
	const [password, setPassword] = React.useState("");
	const [name, setName] = React.useState("");
	const dispatch = useAppDispatch();
	const [submit, { isExecuting }] = useAsyncCallback(async () => {
		await dispatch(login({ password, name }));
		setPassword("");
	}, [name, password]);

	return (
		<Paper className={"Login"} onKeyDown={(e) => e.key === "Enter" && submit()}>
			<Grid container direction={"column"} spacing={4} alignItems={"center"} justifyContent={"center"}>
				<Grid item>
					<Title>Your credentials</Title>
					<Divider className={"Divider"} />
				</Grid>

				<Grid item>
					<TextField id={"login-name"} label="Name" variant={"standard"} value={name} onChange={(e) => setName(e.target.value)} />
				</Grid>

				<Grid item>
					<TextField id={"login-password"} label="Password" value={password} type={"password"} variant={"standard"} onChange={(e) => setPassword(e.target.value)} />
				</Grid>

				<Grid item>
					<Button disabled={name.length === 0 || password.length === 0} color={"primary"} type={"submit"} variant={"outlined"} onClick={submit}>
						{isExecuting ? <CircularProgress /> : "Submit"}
					</Button>
				</Grid>
			</Grid>
		</Paper>
	);
}

export default Login;
