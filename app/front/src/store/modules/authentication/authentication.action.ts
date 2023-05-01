import { createActionGenerator } from "../../utils/utils.actions";
import { AuthenticationState } from "./authentication.reducer";
import { User } from "@apis/backend/generated";

const createAction = createActionGenerator("authentication");

export const setAuthenticationField = createAction<{
	field: keyof Pick<AuthenticationState, "username" | "password">;
	value: string;
}>("setAuthenticationField");

export const setUserFromToken = createAction<User>("setUserFromToken");
