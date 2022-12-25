import React, { useCallback } from "react";
import { useAppDispatch } from "../../../store";
import { register } from "../../../store/module/authentication/authentication.async.action";
import { AuthForm } from "../common/AuthForm";

export function Register() {
	const dispatch = useAppDispatch();

	const validate = useCallback(() => {
		dispatch(register());
	}, [dispatch]);

	return <AuthForm label={"Register"} validate={validate} />;
}
