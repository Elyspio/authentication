import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { applicationPaths } from "../../../config/routes";
import Divider from "@mui/material/Divider";
import { Title } from "../utils/title";
import { AuthorizationAuthentication } from "./AuthorizationAuthentication";
import { setUserAuthorizations } from "../../../store/module/authentication/authentication.action";
import { changeLocation } from "../../../core/services/router.service";

export function AuthorizationsContainer() {
	const dispatch = useAppDispatch();

	const changePath = (path) => () => dispatch(changeLocation(path));

	const { logged, credentials } = useAppSelector((s) => s.authentication);

	return (
		<Grid container justifyContent={"center"} alignItems={"center"}>
			<Grid item>
				<Paper>
					{logged && credentials ? <Authorizations /> : <Button onClick={changePath(applicationPaths.dashboard)}>You are not logged, please login first</Button>}
				</Paper>
			</Grid>
		</Grid>
	);
}

function Authorizations() {
	const {
		authorizations: { authentication },
		username,
	} = useAppSelector((s) => ({
		authorizations: s.authentication.authorizations!,
		username: s.authentication.username!,
	}));

	const [authenticationData, setAuthenticationData] = useState(authentication ?? { roles: [] });

	const dispatch = useAppDispatch();

	const save = React.useCallback(() => {
		dispatch(setUserAuthorizations({ authorizations: { authentication: authenticationData }, username }));
	}, [dispatch, authenticationData, username]);

	return (
		<Paper className={"Authorizations"}>
			<Box m={2} width={"30rem"}>
				<Grid container direction={"column"} alignItems={"center"} spacing={6}>
					<Grid item xs={12} container alignItems={"center"} direction={"column"}>
						<Title>Credentials</Title>
						<Divider className={"Divider"} />
					</Grid>

					<Grid item container xs={12} direction={"column"} spacing={5}>
						<Grid item xs={12}>
							<Typography variant={"overline"} color={"primary"}>
								Authentication
							</Typography>
							<AuthorizationAuthentication data={authenticationData} setData={setAuthenticationData} />
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
