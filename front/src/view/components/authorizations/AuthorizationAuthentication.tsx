import React from "react";
import { Box, FormControl, Grid, InputLabel, MenuItem, Select } from "@material-ui/core";
import { AuthorizationAuthenticationModelRolesEnum, AuthorizationModel } from "../../../core/apis/backend";

type Model = Required<AuthorizationModel>["authentication"];

type Props = {
	setData: (data: Model) => void;
	data: Model;
};

export function AuthorizationAuthentication({ data, setData }: Props) {
	const setProperty = React.useCallback(
		(key: keyof Model) => (event: React.ChangeEvent<{ name?: string; value: any }>) => {
			setData({ ...data, [key]: event.target.value });
		},
		[data, setData]
	);

	return (
		<Box p={1} pl={2} className={"CredentialGithub"}>
			<Grid container spacing={1} direction={"column"}>
				<Grid item xs={12}>
					<FormControl fullWidth>
						<InputLabel id="settings-theme-label">Theme</InputLabel>
						<Select labelId="settings-theme-label" id="settings-theme-select" value={data.roles} label="Theme" fullWidth multiple onChange={setProperty("roles")}>
							{Object.entries(AuthorizationAuthenticationModelRolesEnum).map(([key, value]) => (
								<MenuItem
									value={value}
									disabled={
										value === AuthorizationAuthenticationModelRolesEnum.User ||
										(value === AuthorizationAuthenticationModelRolesEnum.Admin && data.roles.includes(AuthorizationAuthenticationModelRolesEnum.Admin))
									}
								>
									{key}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Grid>
			</Grid>
		</Box>
	);
}
