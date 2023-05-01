import React, { useCallback } from "react";
import { Docker, Github, User } from "@apis/backend/generated";
import { Stack, TextField, Typography } from "@mui/material";
import { Accordion, AccordionDetails, AccordionSummary } from "./common/Accordion";

type UserCredentialsProps = {
	data: User;
	update: (user: User) => void;
};

export function UserCredentials({ data, update }: UserCredentialsProps) {
	const updateGithub = useCallback(
		(field: keyof Github) => (e: React.FocusEvent<HTMLInputElement>) => {
			update({
				...data,
				credentials: {
					...data.credentials,
					github: {
						...(data.credentials.github ?? { user: "", token: "" }),
						[field]: e.target.value,
					},
				},
			});
		},
		[data, update]
	);

	const updateDocker = useCallback(
		(field: keyof Docker) => (e: React.FocusEvent<HTMLInputElement>) => {
			update({
				...data,
				credentials: {
					...data.credentials,
					docker: {
						...(data.credentials.docker ?? { username: "", password: "" }),
						[field]: e.target.value,
					},
				},
			});
		},
		[data, update]
	);

	return (
		<Stack spacing={2}>
			<Typography variant={"overline"} color={"secondary"}>
				Credentials
			</Typography>

			<div>
				<Accordion>
					<AccordionSummary>Github</AccordionSummary>
					<AccordionDetails>
						<Stack spacing={2} m={1}>
							<TextField onBlur={updateGithub("user")} color={"secondary"} label={"Username"} defaultValue={data.credentials.github?.user} />
							<TextField onBlur={updateGithub("token")} type={"password"} color={"secondary"} label={"PAT"} defaultValue={data.credentials.github?.token} />
						</Stack>
					</AccordionDetails>
				</Accordion>
			</div>

			<div>
				<Accordion>
					<AccordionSummary>Docker</AccordionSummary>
					<AccordionDetails>
						<Stack spacing={2} m={1}>
							<TextField onBlur={updateDocker("username")} color={"secondary"} label={"Username"} defaultValue={data.credentials.docker?.username} />
							<TextField onBlur={updateDocker("password")} type={"password"} color={"secondary"} label={"PAT"} defaultValue={data.credentials.docker?.password} />
						</Stack>
					</AccordionDetails>
				</Accordion>
			</div>
		</Stack>
	);
}
