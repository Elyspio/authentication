export const UserNotFound = (user: string) => new Error(`Could not find user ${user}`);
export const AppTokenNotFound = (app: string) => new Error(`Could not find a token for app ${app}`);
