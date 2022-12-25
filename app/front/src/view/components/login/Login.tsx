import React, { useCallback } from "react";
import { useAppDispatch } from "../../../store";
import { AuthForm } from "../common/AuthForm";
import { login } from "../../../store/module/authentication/authentication.async.action";

type LoginProps = {};

export function Login({}: LoginProps) {
	const dispatch = useAppDispatch();

	const validate = useCallback(() => {
		dispatch(login());
	}, [dispatch]);

	return <AuthForm label={"Login"} validate={validate} />;
}
