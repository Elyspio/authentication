import { createActionGenerator } from "../../utils/utils.actions";
import { User } from "@apis/backend/generated";

const createAction = createActionGenerator("users");

export const updateLocalUser = createAction<User>("updateLocalUser");
export const deleteUser = createAction<User["id"]>("deleteUser");
