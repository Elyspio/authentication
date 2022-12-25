import { createActionBase } from "../../common/common.actions";
import { AuthenticationState } from "./authentication.reducer";

const createAction = createActionBase("authentication");

export const setAuthenticationField = createAction<{ field: keyof Pick<AuthenticationState, "username" | "password">; value: string }>("setAuthenticationField");
