import { createActionBase } from "../../common/common.actions";
import { User } from "../../../core/apis/backend/generated";

const createAction = createActionBase("users");

export const updateLocalUser = createAction<User>("updateLocalUser");
export const deleteUser = createAction<User["id"]>("deleteUser");
