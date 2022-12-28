import { createActionBase } from "../../common/common.actions";
import { User } from "../../../core/apis/backend/generated";

const createAction = createActionBase("users");

export const updateUser = createAction<User>("updateUser");
export const deleteUser = createAction<User["id"]>("deleteUser");
