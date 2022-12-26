import { createActionBase } from "../../common/common.actions";
import { AuthenticationState } from "./authentication.reducer";
import { User } from "../../../core/apis/backend/generated";

const createAction = createActionBase("authentication");

export const setAuthenticationField = createAction<{ field: keyof Pick<AuthenticationState, "username" | "password">; value: string }>("setAuthenticationField");

export const setUserFromToken = createAction<User>("setUserFromToken");
