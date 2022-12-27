import React, { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../../store";
import { register } from "../../../store/module/authentication/authentication.async.action";
import { AuthForm } from "../common/AuthForm";
import { usePermissions } from "../../hooks/usePermissions";
import { RequireRole } from "../common/RequireRole";
import { AuthenticationRoles } from "../../../core/apis/backend/generated";

export function Register() {
	const dispatch = useAppDispatch();

	const isInit = useAppSelector((s) => s.authentication.init);

	const validate = useCallback(() => {
		dispatch(register());
	}, [dispatch]);

	const { isAdmin } = usePermissions();

	if (!isAdmin && !isInit) return <RequireRole missing={AuthenticationRoles.Admin} />;

	return <AuthForm label={"Register"} validate={validate} />;
}
