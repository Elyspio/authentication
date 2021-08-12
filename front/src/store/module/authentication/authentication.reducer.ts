import {createReducer} from "@reduxjs/toolkit";
import {getUserMetadata, login, logout} from "./authentication.action";
import {CredentialsModel, UserSettingsModel} from "../../../core/apis/backend";
import {toast} from "react-toastify";

export interface AuthenticationState {
	logged: boolean,
	token?: string,
	username?: string,
	credentials?: CredentialsModel,
	settings?: UserSettingsModel
}

const defaultState: AuthenticationState = {
	logged: false,
};

export const authenticationReducer = createReducer(defaultState, (builder) => {

	builder.addCase(getUserMetadata.fulfilled, (state, action) => {
		if (action.payload) {
			state.logged = true;
			state.credentials = action.payload.credentials
			state.username = action.payload.username;
			state.settings = action.payload.settings
			state.token = action.payload.token

			toast.success("Logged in")
		}
	});

	builder.addCase(getUserMetadata.rejected, (state, e) => {
		toast.error("Could not login")
		console.error("Could not login", e.error);
	})

	builder.addCase(logout.fulfilled, state => {
		state.logged = defaultState.logged;
		state.credentials = defaultState.credentials;
		state.username = defaultState.username;
		state.settings = defaultState.settings;
		state.token = defaultState.token

		toast.success("Logged out")

	})

});
