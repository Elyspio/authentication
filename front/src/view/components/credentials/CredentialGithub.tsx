import React from "react";
import { Box, FormControl, Grid, Paper, TextField } from "@mui/material";
import { CredentialsModel } from "../../../core/apis/backend";

type Model = Required<CredentialsModel>["github"];

type Props = {
	setData: (data: Model) => void;
	data: Model;
};

export function CredentialGithub({ data, setData }: Props) {
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
							<TextField id="filled-basic" label="User" value={data.user} onChange={setProperty("user")} />
						</FormControl>
					</Grid>
					<Grid item xs={12}>
						<FormControl fullWidth>
							<TextField id="filled-basic" label="Token" value={data.token} onChange={setProperty("token")} />
						</FormControl>
					</Grid>
				</Grid>
			</Box>
		</Paper>
	);
}
