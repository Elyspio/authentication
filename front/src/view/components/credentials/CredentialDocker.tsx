import React from "react";
import { Box, FormControl, Grid, Paper, TextField } from "@material-ui/core";
import { CredentialsModel } from "../../../core/apis/backend";

type Model = Required<CredentialsModel>["docker"];

type Props = {
	setData: (data: Model) => void;
	data: Model;
};

export function CredentialDocker({ data, setData }: Props) {
	const setProperty = React.useCallback(
		(key: keyof Model) => (event: React.ChangeEvent<{ name?: string; value: string }>) => {
			setData({ ...data, [key]: event.target.value });
		},
		[data, setData]
	);

	return (
		<Paper className={"CredentialGithub"}>
			<Box p={1} pl={2}>
				<Grid container spacing={1} direction={"column"}>
					<Grid item xs={12}>
						<FormControl fullWidth>
							<TextField id="filled-basic" label="Username" value={data.username} onChange={setProperty("username")} />
						</FormControl>
					</Grid>
					<Grid item xs={12}>
						<FormControl fullWidth>
							<TextField id="filled-basic" label="Password" value={data.password} onChange={setProperty("password")} />
						</FormControl>
					</Grid>
				</Grid>
			</Box>
		</Paper>
	);
}
