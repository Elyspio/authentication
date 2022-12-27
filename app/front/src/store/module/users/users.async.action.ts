import { createAsyncThunk } from "@reduxjs/toolkit";
import { getService } from "../../common/common.actions";
import { UsersService } from "../../../core/services/users.service";

export const getAllUsers = createAsyncThunk("users/getAllUsers", async (_, { extra }) => {
	const service = getService(UsersService, extra);
	return service.getAll();
});
