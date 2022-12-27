import { inject, injectable } from "inversify";
import { BackendApi } from "../apis/backend";
import { BaseService } from "./technical/base.service";
import { User } from "../apis/backend/generated";

@injectable()
export class UsersService extends BaseService {
	@inject(BackendApi)
	private backendApi!: BackendApi;

	/**
	 * @return if at least one user exist in database
	 */
	public checkIfUsersExist = () => this.backendApi.users.checkIfUsersExist();
	public getAll = () => this.backendApi.users.getAll();
	public get = (username: string) => this.backendApi.users.get(username);
	public update = (user: User) => this.backendApi.users.updateUser(user.username, user);
}
