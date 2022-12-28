import React, { useCallback, useMemo } from "react";
import { FormControlLabel, Paper, Stack, Switch, TextField } from "@mui/material";
import { Title } from "../../common/Title";
import { useParams } from "react-router";
import { AuthenticationRoles, Docker, Github, User } from "../../../../core/apis/backend/generated";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { RequireRole } from "../../common/RequireRole";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, { AccordionSummaryProps } from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { updateUser } from "../../../../store/module/users/users.async.action";

const Accordion = styled((props: AccordionProps) => <MuiAccordion disableGutters elevation={0} square {...props} />)(({ theme }) => ({
	border: `1px solid ${theme.palette.divider}`,
	"&:not(:last-child)": {
		borderBottom: 0,
	},
	"&:before": {
		display: "none",
	},
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => <MuiAccordionSummary expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />} {...props} />)(
	({ theme }) => ({
		flexDirection: "row-reverse",
		"& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
			transform: "rotate(90deg)",
		},
		"& .MuiAccordionSummary-content": {
			marginLeft: theme.spacing(1),
		},
	})
);

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
	padding: theme.spacing(2),
	borderTop: "1px solid rgba(0, 0, 0, .125)",
	backgroundColor: theme.palette.background.default,
}));

export function UserDetail() {
	const { id } = useParams<{ id: User["id"] }>();

	const dispatch = useAppDispatch();

	const { users, logged } = useAppSelector((s) => ({ users: s.users.all, logged: s.authentication.user }));

	const user = useMemo(() => users[id!], [users, id]);

	const updateRemoteUser = useCallback((user: User) => dispatch(updateUser(user)), [dispatch]);

	const toggleDisabled = useCallback(
		() =>
			updateRemoteUser({
				...user,
				disabled: !user.disabled,
			}),
		[updateRemoteUser, user]
	);

	const updateGithub = useCallback(
		(field: keyof Github) => (e: React.FocusEvent<HTMLInputElement>) => {
			updateRemoteUser({
				...user,
				credentials: {
					...user.credentials,
					github: {
						...(user.credentials.github ?? { user: "", token: "" }),
						[field]: e.target.value,
					},
				},
			});
		},
		[user, updateRemoteUser]
	);

	const updateDocker = useCallback(
		(field: keyof Docker) => (e: React.FocusEvent<HTMLInputElement>) => {
			updateRemoteUser({
				...user,
				credentials: {
					...user.credentials,
					docker: {
						...(user.credentials.docker ?? { username: "", password: "" }),
						[field]: e.target.value,
					},
				},
			});
		},
		[user, updateRemoteUser]
	);

	if (!logged) return <RequireRole missing={AuthenticationRoles.User} />;

	if (!user) return null;

	return (
		<Paper>
			<Stack p={2} m={1}>
				<Title>{user.username}'s infos</Title>
				<Stack m={2} p={2} borderRadius={3} spacing={4}>
					<Stack bgcolor={"background.default"} spacing={2} p={1}>
						<FormControlLabel
							onClick={toggleDisabled}
							sx={{ width: 155 }}
							control={<Switch defaultChecked={user.disabled} />}
							label="Disable login"
							labelPlacement={"start"}
						/>
					</Stack>

					<Accordion defaultExpanded>
						<AccordionSummary>Github</AccordionSummary>
						<AccordionDetails>
							<Stack spacing={2} m={1}>
								<TextField onBlur={updateGithub("user")} color={"secondary"} label={"Username"} defaultValue={user.credentials.github?.user} />
								<TextField onBlur={updateGithub("token")} type={"password"} color={"secondary"} label={"PAT"} defaultValue={user.credentials.github?.token} />
							</Stack>
						</AccordionDetails>
					</Accordion>

					<Accordion defaultExpanded>
						<AccordionSummary>Docker</AccordionSummary>
						<AccordionDetails>
							<Stack spacing={2} m={1}>
								<TextField onBlur={updateDocker("username")} color={"secondary"} label={"Username"} defaultValue={user.credentials.docker?.username} />
								<TextField
									onBlur={updateDocker("password")}
									type={"password"}
									color={"secondary"}
									label={"Password"}
									defaultValue={user.credentials.docker?.password}
								/>
							</Stack>
						</AccordionDetails>
					</Accordion>
				</Stack>
			</Stack>
		</Paper>
	);
}
