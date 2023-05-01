import React, { useCallback } from "react";
import { AuthenticationRoles, SousMarinJauneRole, User, VideyoRole } from "@apis/backend/generated";
import { Autocomplete, Box, Chip, Stack, TextField, Typography } from "@mui/material";
import { Accordion, AccordionDetails, AccordionSummary } from "./common/Accordion";
import { usePermissions } from "@hooks/usePermissions";

type UserCredentialsProps = {
	data: User;
	update: (user: User) => void;
};

export function UserAuthorizations({ data, update }: UserCredentialsProps) {
	const updateAuthenticationRoles = useCallback(
		(_, v: AuthenticationRoles[]) => {
			update({
				...data,
				authorizations: {
					...data.authorizations,
					authentication: {
						roles: v as AuthenticationRoles[],
					},
				},
			});
		},
		[data, update]
	);

	const updateVideyoRoles = useCallback(
		(_, v: VideyoRole[]) => {
			update({
				...data,
				authorizations: {
					...data.authorizations,
					videyo: {
						roles: v,
					},
				},
			});
		},
		[data, update]
	);

	const updateSousMarinJauneRoles = useCallback(
		(_, v: SousMarinJauneRole[]) => {
			update({
				...data,
				authorizations: {
					...data.authorizations,
					sousMarinJaune: {
						roles: v,
					},
				},
			});
		},
		[data, update]
	);

	const { isAdmin } = usePermissions();

	const authRoles = Object.values(AuthenticationRoles) as AuthenticationRoles[];
	const videyoRoles = Object.values(VideyoRole) as VideyoRole[];
	const sousMarinJauneRoles = Object.values(SousMarinJauneRole) as SousMarinJauneRole[];

	function isAuthenticationOptionDisabled(option: AuthenticationRoles) {
		return option === AuthenticationRoles.Admin && isAdmin;
	}

	return (
		<Stack spacing={2}>
			<Typography variant={"overline"} color={"secondary"}>
				Authorizations
			</Typography>

			<Stack direction={"row"} spacing={4}>
				<Box width={"100%"}>
					<Accordion>
						<AccordionSummary>Authentication</AccordionSummary>
						<AccordionDetails>
							<Stack spacing={2} m={1}>
								<Autocomplete
									renderInput={(params) => <TextField {...params} label={"Roles"} />}
									multiple
									options={authRoles}
									defaultValue={data.authorizations.authentication.roles}
									onChange={updateAuthenticationRoles}
									renderTags={(value, getTagProps) => {
										const values = [...value].sort();
										return (
											<Stack direction={"row"} spacing={1}>
												{values.map((v, i) => {
													const props = getTagProps({ index: i });
													return <Chip key={v} label={v} onDelete={!isAuthenticationOptionDisabled(v) ? props.onDelete : undefined} />;
												})}
											</Stack>
										);
									}}
									getOptionDisabled={(option) => isAuthenticationOptionDisabled(option)}
								/>
							</Stack>
						</AccordionDetails>
					</Accordion>
				</Box>

				<Box width={"100%"}>
					<Accordion>
						<AccordionSummary>Videyo</AccordionSummary>
						<AccordionDetails>
							<Stack spacing={2} m={1}>
								<Autocomplete
									renderInput={(params) => <TextField {...params} label={"Roles"} />}
									multiple
									options={videyoRoles}
									defaultValue={data.authorizations.videyo?.roles ?? []}
									onChange={updateVideyoRoles}
									renderTags={(value, getTagProps) => {
										const values = [...value].sort();
										return (
											<Stack direction={"row"} spacing={1}>
												{values.map((v, i) => {
													const props = getTagProps({ index: i });
													return <Chip key={v} label={v} onDelete={props.onDelete} />;
												})}
											</Stack>
										);
									}}
								/>
							</Stack>
						</AccordionDetails>
					</Accordion>
				</Box>

				<Box width={"100%"}>
					<Accordion>
						<AccordionSummary>Sous Marin Jaune</AccordionSummary>
						<AccordionDetails>
							<Stack spacing={2} m={1}>
								<Autocomplete
									renderInput={(params) => <TextField {...params} label={"Roles"} />}
									multiple
									options={sousMarinJauneRoles}
									defaultValue={data.authorizations.sousMarinJaune?.roles ?? []}
									onChange={updateSousMarinJauneRoles}
									renderTags={(value, getTagProps) => {
										const values = [...value].sort();
										return (
											<Stack direction={"row"} spacing={1}>
												{values.map((v, i) => {
													const props = getTagProps({ index: i });
													return <Chip key={v} label={v} onDelete={props.onDelete} />;
												})}
											</Stack>
										);
									}}
								/>
							</Stack>
						</AccordionDetails>
					</Accordion>
				</Box>
			</Stack>
		</Stack>
	);
}
