import React, { useCallback } from "react";
import { Box, Button, Divider, Paper, Stack, TextField, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useAppDispatch, useAppSelector } from "@store";
import { setAuthenticationField } from "@modules/authentication/authentication.action";

type AuthFormProps = {
	label: string;
	validate: () => void;

	buttonLabel?: string;
	disableUsername?: boolean;
};

export function AuthForm({ validate, label, buttonLabel, disableUsername }: AuthFormProps) {
	const { password, username } = useAppSelector((state) => state.authentication);

	const dispatch = useAppDispatch();

	const setOnChange = useCallback(
		(state: "username" | "password") => (e: React.ChangeEvent<HTMLInputElement>) => {
			dispatch(setAuthenticationField({ field: state, value: e.target.value }));
		},
		[dispatch]
	);

	const {
		palette: { secondary },
	} = useTheme();

	const onSubmit = useCallback(
		(e: React.ChangeEvent<HTMLFormElement>) => {
			e.stopPropagation();
			e.preventDefault();
			validate();
		},
		[validate]
	);

	return (
		<Stack height={"100%"} alignItems={"center"} justifyContent={"center"}>
			<Paper>
				<form onSubmit={onSubmit}>
					<Stack mx={4} my={2} spacing={2} minWidth={300} alignItems={"center"}>
						<Typography variant={"overline"} fontSize={"110%"}>
							{label}
						</Typography>
						<Box pb={2} width={"100%"}>
							<Divider flexItem color={secondary.main}></Divider>
						</Box>

						<TextField disabled={disableUsername} type={"text"} onChange={setOnChange("username")} fullWidth label={"Username"} defaultValue={username} />
						<TextField type={"password"} onChange={setOnChange("password")} fullWidth label={"Password"} defaultValue={password} />

						<Box pt={1}>
							<Button type={"submit"} disabled={!username || !password} variant={"contained"} color={"secondary"} sx={{ borderRadius: 2, width: 130 }}>
								{buttonLabel ?? label}
							</Button>
						</Box>
					</Stack>
				</form>
			</Paper>
		</Stack>
	);
}
