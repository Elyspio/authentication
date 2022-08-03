import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { applicationPaths } from "../../../config/routes";
import Divider from "@mui/material/Divider";
import { Title } from "../utils/title";
import { CredentialGithub } from "./CredentialGithub";
import { CredentialDocker } from "./CredentialDocker";
import { setUserCredentials } from "../../../store/module/authentication/authentication.action";
import { useDispatch } from "react-redux";
import { changeLocation } from "../../../core/services/router.service";

export function CredentialContainer() {
	const dispatch = useDispatch();

	const changePath = (path) => () => dispatch(changeLocation(path));

	const { logged, credentials } = useAppSelector((s) => s.authentication);

	return (
		<Grid container justifyContent={"center"} alignItems={"center"}>
			<Grid item>
				<Paper>{logged && credentials ? <Credentials /> : <Button onClick={changePath(applicationPaths.dashboard)}>You are not logged, please login first</Button>}</Paper>
			</Grid>
		</Grid>
	);
}

function Credentials() {
	const {
		credential: { docker, github },
		username,
	} = useAppSelector((s) => ({ credential: s.authentication.credentials!, username: s.authentication.username! }));

	const [githubData, setGithubData] = useState(github ?? { user: username, token: "" });
	const [dockerData, setDockerData] = useState(docker ?? { username: username, password: "" });

	const dispatch = useAppDispatch();

	const save = React.useCallback(() => {
		dispatch(setUserCredentials({ credential: { github: githubData, docker: dockerData }, username }));
	}, [dispatch, githubData, dockerData, username]);

	return (
		<Paper className={"Credentials"}>
			<Box m={2} width={"30rem"}>
				<Grid container direction={"column"} alignItems={"center"} spacing={6}>
					<Grid item xs={12} container alignItems={"center"} direction={"column"}>
						<Title>Credentials</Title>
						<Divider className={"Divider"} />
					</Grid>

					<Grid item container xs={12} direction={"column"} spacing={5}>
						<Grid item xs={12}>
							<Typography variant={"overline"} color={"primary"}>
								Docker
							</Typography>

							<CredentialDocker data={dockerData} setData={setDockerData} />
						</Grid>

						<Grid item xs={12}>
							<Typography variant={"overline"} color={"primary"}>
								Github
							</Typography>
							<CredentialGithub data={githubData} setData={setGithubData} />
						</Grid>
					</Grid>
					<Grid item xs={12} container justifyContent={"center"}>
						<Button color={"primary"} variant={"outlined"} onClick={save}>
							Save
						</Button>
					</Grid>
				</Grid>
			</Box>
		</Paper>
	);
}
