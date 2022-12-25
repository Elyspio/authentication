import React, { useCallback } from "react";
import { Box, Button, Divider, Paper, Stack, TextField, Typography, useTheme } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../store";
import { setAuthenticationField } from "../../../store/module/authentication/authentication.action";

type AuthFormProps = {
	label: string;
	validate: () => void;
};

export function AuthForm({ validate, label }: AuthFormProps) {
	const { password, username } = useAppSelector((state) => state.authentication);

	const dispatch = useAppDispatch();

	const setOnChange = useCallback(
		(state: "username" | "password") => (e: React.ChangeEvent<HTMLInputElement>) => {
			dispatch(setAuthenticationField({ field: state, value: e.target.value }));
		},
		[dispatch]
	);

	const {
		palette: { primary },
	} = useTheme();

	return (
		<Stack height={"100%"} alignItems={"center"} justifyContent={"center"}>
			<Paper>
				<Stack m={4} spacing={2} minWidth={300} alignItems={"center"}>
					<Typography variant={"overline"} fontSize={"100%"}>
						{label}
					</Typography>
					<Box pb={2} width={"100%"}>
						<Divider flexItem color={primary.main}></Divider>
					</Box>
					<TextField onChange={setOnChange("username")} fullWidth label={"Username"} />
					<TextField onChange={setOnChange("password")} fullWidth label={"Password"} />

					<Button disabled={!username || !password} onClick={validate} variant={"contained"} sx={{ borderRadius: 2 }}>
						{label}
					</Button>
				</Stack>
			</Paper>
		</Stack>
	);
}
