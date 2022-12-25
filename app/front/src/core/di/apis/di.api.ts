import { BackendApi } from "../../apis/backend";
import { Container } from "inversify";

export const addApis = (container: Container) => {
	container.bind(BackendApi).toSelf();
};
