import { inject, injectable } from "inversify";
import { BackendApi } from "../apis/backend";
import { BaseService } from "./common/base.service";

@injectable()
export class UsersService extends BaseService {
	@inject(BackendApi)
	private backendApi!: BackendApi;

	/**
	 * @return if at least one user exist in database
	 */
	public checkIfUsersExist = () => this.backendApi.users.checkIfUsersExist();
	public getAll = () => this.backendApi.users.getAll();
	public get = (username) => this.backendApi.users.get(username);
}
