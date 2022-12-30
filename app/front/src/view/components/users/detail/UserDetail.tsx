import React, { useCallback, useEffect, useMemo } from "react";
import { Button, Dialog, FormControlLabel, Paper, Stack, Switch, Tooltip } from "@mui/material";
import { Title } from "../../common/Title";
import { useParams } from "react-router";
import { AuthenticationRoles, User } from "../../../../core/apis/backend/generated";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { RequireRole } from "../../common/RequireRole";
import { deleteUserRemote, getUser, updateUser } from "../../../../store/module/users/users.async.action";
import IconButton from "@mui/material/IconButton";
import { DeleteForever } from "@mui/icons-material";
import { changeLocation } from "../../../../core/services/router.service";
import { UserCredentials } from "./UserCredentials";
import { UserAuthorizations } from "./UserAuthorizations";
import { useModal } from "../../../hooks/useModal";
import { AuthForm } from "../../common/AuthForm";
import { changePassword } from "../../../../store/module/authentication/authentication.async.action";
import { setAuthenticationField } from "../../../../store/module/authentication/authentication.action";

export function UserDetail() {
	const { id } = useParams<{ id: User["id"] }>();

	const dispatch = useAppDispatch();

	const { users, logged } = useAppSelector((s) => ({ users: s.users.all, logged: s.authentication.user }));

	const user = useMemo(() => users[id!], [users, id]);

	const updateRemoteUser = useCallback((user: User) => dispatch(updateUser(user)), [dispatch]);

	const delUser = useCallback(() => {
		dispatch(deleteUserRemote(user.id));
		dispatch(changeLocation("dashboard"));
	}, [dispatch, user?.id]);

	const toggleDisabled = useCallback(
		() =>
			updateRemoteUser({
				...user,
				disabled: !user.disabled,
			}),
		[updateRemoteUser, user]
	);

	useEffect(() => {
		dispatch(getUser(id!));
	}, [id, dispatch]);

	const isConnectedUser = useMemo(() => logged?.id === user?.id, [logged, user]);

	const { setOpen, open, setClose } = useModal(false);

	const updatePassword = useCallback(() => {
		dispatch(changePassword());
		setClose();
	}, [dispatch, setClose]);

	const startUpdatePassword = useCallback(() => {
		setOpen();
		dispatch(setAuthenticationField({ field: "username", value: user.username }));
	}, [setOpen, user, dispatch]);

	if (!logged) return <RequireRole missing={AuthenticationRoles.User} />;

	if (!user) return null;

	return (
		<Paper>
			<Stack p={2} m={1}>
				<Stack direction={"row"} spacing={3} height={40} alignItems={"center"}>
					<Title>{user.username}'s infos</Title>

					<Tooltip title={isConnectedUser ? "You can't delete yourself" : ""} placement={"right-end"}>
						<div>
							<IconButton color={"error"} onClick={delUser} sx={{ mr: 1 }} disabled={isConnectedUser}>
								<DeleteForever />
							</IconButton>
						</div>
					</Tooltip>

					<Button color={"secondary"} variant={"outlined"} onClick={startUpdatePassword}>
						Change password
					</Button>
				</Stack>
				<Stack m={2} p={2} borderRadius={3} spacing={4}>
					<Stack bgcolor={"background.default"} spacing={2} p={1} px={0}>
						<FormControlLabel
							onClick={toggleDisabled}
							sx={{ width: 155 }}
							control={<Switch defaultChecked={user.disabled} />}
							label="Disable login"
							labelPlacement={"start"}
						/>
					</Stack>

					<UserAuthorizations data={user} update={updateRemoteUser} />

					<UserCredentials data={user} update={updateRemoteUser} />
				</Stack>
			</Stack>

			<Dialog open={open} onClose={setClose}>
				<AuthForm label={`Change ${user.username} password`} validate={updatePassword} buttonLabel={"Change"} disableUsername />
			</Dialog>
		</Paper>
	);
}
