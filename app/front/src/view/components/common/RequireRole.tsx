import React, { useCallback } from "react";
import { Button, Paper, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { AuthenticationRoles } from "@apis/backend/generated";
import { useAppDispatch, useAppSelector } from "@store";
import { logout } from "@modules/authentication/authentication.async.action";
import { Title } from "./Title";

type RequireLoginProps = {
	missing: AuthenticationRoles;
};

export function RequireRole({ missing }: RequireLoginProps) {
	const logged = useAppSelector((s) => s.authentication.user);

	const dispatch = useAppDispatch();

	const logoutCb = useCallback(() => {
		dispatch(logout());
	}, [dispatch]);

	const { palette } = useTheme();

	const loginBtn = (
		<Button onClick={logoutCb} variant={"outlined"} size={"small"} component={"span"} sx={{ mx: 1 }}>
			login
		</Button>
	);

	return (
		<Paper>
			<Stack spacing={2} m={2} p={4}>
				<Title>Missing Permissions</Title>

				<Stack spacing={1}>
					{logged ? (
						<>
							<Typography variant={"body1"}>
								You are connected as{" "}
								<Typography component={"span"} color={"secondary"} fontSize={"medium"}>
									{logged.id}
								</Typography>{" "}
								but you are missing the{" "}
								<Typography component={"span"} color={palette.warning.main} fontSize={"medium"}>
									{missing}
								</Typography>{" "}
								role
							</Typography>
							<Typography> Please {loginBtn} with an other account</Typography>
						</>
					) : (
						<Typography>You are not connected, please {loginBtn} first</Typography>
					)}
				</Stack>
			</Stack>
		</Paper>
	);
}
