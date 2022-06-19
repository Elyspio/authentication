import React from "react";
import { Box, Button, CircularProgress, Grid, Paper, TextField } from "@mui/material";
import Divider from "@mui/material/Divider";
import { useAppDispatch } from "../../../../store";
import { create } from "../../../../store/module/authentication/authentication.action";
import { useAsyncCallback } from "../../../hooks/useAsyncCallback";
import { Title } from "../../utils/title";

function Register() {
	const [password, setPassword] = React.useState("");
	const [name, setName] = React.useState("");
	const dispatch = useAppDispatch();
	const [submit, { isExecuting }] = useAsyncCallback(async () => {
		await dispatch(create({ password, name }));
		setPassword("");
	}, [name, password]);

	return (
		<Paper className={"Create"} onKeyDown={(e) => e.key === "Enter" && submit()}>
			<Box p={2} mx={4}>
				<Grid container direction={"column"} spacing={4} alignItems={"center"} justifyContent={"center"}>
					<Grid item container>
						<Title>Create a new user</Title>
						<Divider className={"Divider"} />
					</Grid>

					<Grid item>
						<TextField id={"login-name"} label="Name" variant={"standard"} value={name} onChange={(e) => setName(e.target.value)} />
					</Grid>

					<Grid item>
						<TextField id={"login-password"} label="Password" value={password} type={"password"} variant={"standard"} onChange={(e) => setPassword(e.target.value)} />
					</Grid>

					<Grid item>
						<Box marginTop={2}>
							<Button disabled={name.length === 0 || password.length === 0} color={"primary"} type={"submit"} variant={"outlined"} onClick={submit}>
								{isExecuting ? <CircularProgress /> : "Submit"}
							</Button>
						</Box>
					</Grid>
				</Grid>
			</Box>
		</Paper>
	);
}

export default Register;
