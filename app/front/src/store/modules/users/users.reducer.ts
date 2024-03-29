import { createReducer } from "@reduxjs/toolkit";
import { User } from "@apis/backend/generated";
import { getAllUsers } from "./users.async.action";
import { deleteUser, updateLocalUser } from "./users.action";

export interface AuthenticationState {
	all: Record<User["id"], User>;
}

const defaultState = (): AuthenticationState => ({
	all: {},
});

export const usersReducer = createReducer(defaultState, (builder) => {
	builder.addCase(getAllUsers.fulfilled, (state, action) => {
		state.all = {};
		action.payload.forEach((user) => {
			state.all[user.id] = user;
		});
	});

	builder.addCase(updateLocalUser, (state, action) => {
		state.all[action.payload.id] = action.payload;
	});

	builder.addCase(deleteUser, (state, action) => {
		delete state.all[action.payload];
	});
});
