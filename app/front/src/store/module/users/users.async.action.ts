import { createAsyncThunk } from "@reduxjs/toolkit";
import { getService } from "../../common/common.actions";
import { UsersService } from "../../../core/services/users.service";
import { User } from "../../../core/apis/backend/generated";
import { toast } from "react-toastify";

export const getAllUsers = createAsyncThunk("users/getAllUsers", async (_, { extra }) => {
	const service = getService(UsersService, extra);
	return service.getAll();
});

export const getUser = createAsyncThunk("users/getAllUsers", async (id: User["id"], { extra }) => {
	const service = getService(UsersService, extra);
	return service.get(id);
});

export const updateUser = createAsyncThunk("users/updateUser", async (user: User, { extra }) => {
	const service = getService(UsersService, extra);
	await toast.promise(service.update(user), {
		error: "Could not update user",
	});
});

export const deleteUserRemote = createAsyncThunk("users/deleteUser", async (username: User["id"], { extra }) => {
	const service = getService(UsersService, extra);
	return service.delete(username);
});
