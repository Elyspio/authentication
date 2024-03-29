import { useMemo } from "react";
import { useAppSelector } from "@store";
import { AuthenticationRoles } from "@apis/backend/generated";

export function usePermissions() {
	const authenticatedUser = useAppSelector((s) => s.authentication.user);

	const isAdmin = useMemo(() => authenticatedUser?.authorizations.authentication.roles.includes(AuthenticationRoles.Admin) ?? false, [authenticatedUser]);

	return { isAdmin };
}
