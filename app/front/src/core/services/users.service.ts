import { inject, injectable } from "inversify";
import { BackendApi } from "@apis/backend";
import { BaseService } from "./technical/base.service";
import { User } from "@apis/backend/generated";

@injectable()
export class UsersService extends BaseService {
	@inject(BackendApi)
	private backendApi!: BackendApi;

	/**
	 * @return if at least one user exist in database
	 */
	public checkIfUsersExist() {
		return this.backendApi.users.checkIfUsersExist();
	}

	public getAll() {
		return this.backendApi.users.getAll();
	}

	public get(id: string) {
		return this.backendApi.users.get(id);
	}

	public delete(id: string) {
		return this.backendApi.users.deleteUser(id);
	}

	public update(user: User) {
		return this.backendApi.users.updateUser(user.id, user);
	}
}
