import React from "react";
import { Button, ButtonProps, Grid, Paper } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../store";
import { AuthorizationAuthenticationModelRolesEnum } from "../../core/apis/backend";
import { applicationPaths } from "../../config/routes";
import { changeLocation } from "../../core/services/router.service";

export function Dashboard() {
	const { logged, isAdmin } = useAppSelector((state) => {
		return {
			logged: state.authentication.logged,
			isAdmin: state.authentication.authorizations?.authentication?.roles.includes(AuthorizationAuthenticationModelRolesEnum.Admin),
		};
	});

	const btns = React.useMemo(() => {
		const arr: { label: string; color?: ButtonProps["color"]; path: string }[] = [];
		if (logged) {
			arr.push({ label: "Settings", path: applicationPaths.settings });
			arr.push({ label: "Credentials", path: applicationPaths.credentials });
		}
		if (isAdmin) {
			arr.push({ label: "Authorizations", color: "primary", path: applicationPaths.authorizations });
			arr.push({ label: "Register", color: "primary", path: applicationPaths.register });
		}
		return arr;
	}, [logged, isAdmin]);

	const dispatch = useAppDispatch();

	return (
		<Paper>
			<Grid container justifyContent={"center"} alignItems={"center"}>
				{btns.map((btn) => (
					<Grid item key={btn.label}>
						<Button color={btn.color} onClick={() => dispatch(changeLocation(btn.path))}>
							{btn.label}
						</Button>
					</Grid>
				))}
			</Grid>
		</Paper>
	);
}
