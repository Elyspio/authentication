import { createAsyncThunk } from "@reduxjs/toolkit";
import { getService } from "../../utils/utils.actions";
import { UsersService } from "@services/users.service";
import { User } from "@apis/backend/generated";
import { toast } from "react-toastify";
import { updateLocalUser } from "./users.action";
import { StoreState } from "@store";
import { refreshToken } from "../authentication/authentication.async.action";

export const getAllUsers = createAsyncThunk("users/getAllUsers", async (_, { extra }) => {
	const service = getService(UsersService, extra);
	return service.getAll();
});

export const getUser = createAsyncThunk("users/getUser", async (id: User["id"], { extra, dispatch }) => {
	const service = getService(UsersService, extra);
	const user = await service.get(id);

	dispatch(updateLocalUser(user));
});

export const updateUser = createAsyncThunk("users/updateUser", async (user: User, { extra, getState, dispatch }) => {
	const service = getService(UsersService, extra);
	await toast.promise(service.update(user), {
		error: "Could not update user",
	});

	const {
		authentication: { user: loggedUser },
	} = getState() as StoreState;

	if (user.id === loggedUser?.id) {
		dispatch(refreshToken());
	}
});

export const deleteUserRemote = createAsyncThunk("users/deleteUser", async (username: User["id"], { extra }) => {
	const service = getService(UsersService, extra);
	return service.delete(username);
});
