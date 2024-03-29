import React, { useCallback } from "react";
import { useAppDispatch } from "@store";
import { AuthForm } from "../common/AuthForm";
import { login } from "@modules/authentication/authentication.async.action";

export function Login() {
	const dispatch = useAppDispatch();

	const validate = useCallback(() => {
		dispatch(login());
	}, [dispatch]);

	return <AuthForm label={"Login"} validate={validate} />;
}
