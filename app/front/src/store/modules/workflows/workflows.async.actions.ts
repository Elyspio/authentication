import { createAsyncActionGenerator, getService } from "@store/utils/utils.actions";
import { checkIfUserExist, silentLogin } from "@modules/authentication/authentication.async.action";
import { UpdateSocketService } from "@services/socket/update.socket.service";
import { deleteUser, updateLocalUser } from "@modules/users/users.action";

const createAsyncThunk = createAsyncActionGenerator("workflows");
export const initApp = createAsyncThunk("initApp", async (_, { dispatch, extra }) => {
	dispatch(checkIfUserExist());
	dispatch(silentLogin());

	const updateSocketService = getService(UpdateSocketService, extra);

	const socket = await updateSocketService.createSocket();

	socket.on("UserUpdated", (user) => dispatch(updateLocalUser(user)));
	socket.on("UserDeleted", (id) => dispatch(deleteUser(id)));
});
