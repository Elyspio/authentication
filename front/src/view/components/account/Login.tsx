import React from 'react';
import './Login.scss'
import {Button, Paper, Snackbar, TextField, Typography} from "@material-ui/core";
import {Alert} from "@material-ui/lab";
import {Services} from "../../../core/services";
import {toast} from "react-toastify";

interface Props {
    onAuthorized?: Function,
    onForbidden?: Function,
}


function Login(props: Props) {

    const [password, setPassword] = React.useState("")
    const [name, setName] = React.useState("")

    const submit = async () => {

        let authorisation = await Services.authentication.isAuthorized({name, password});
        if (authorisation.success && authorisation.token) {

            if (props.onAuthorized) {
                props.onAuthorized();
            }

            toast.success("Ok")

        } else {
            toast.error("Vous n'êtes pas autorisé à faire cette action")

            if (props.onForbidden) {
                props.onForbidden();
            }
        }

        setPassword("")
        // setName("")
    }

    const isValid = async () => {

        let {success} = await Services.authentication.isValid();
        if (success) {
            toast.success("OK")

        } else {
            toast.error("Vous n'êtes pas autorisé à faire cette action")
        }


    }


    const body = (
        <Paper className={"login-body"} onKeyDown={e => e.keyCode === 13 && submit()}>

            <Typography variant={"h6"}>Login</Typography>

            <TextField
                id={"login-name"}
                label="Name"
                value={name}
                onChange={e => setName(e.target.value)}/>

            <TextField
                id={"login-password"}
                label="Password"
                value={password}
                type={"password"}
                onChange={e => setPassword(e.target.value)}/>

            <Button color={"primary"} type={"submit"} onClick={submit}>Submit</Button>

        </Paper>
    );

    return (
        <div className={"login"}>
            {body}

            <Button onClick={isValid}>IsValid</Button>

        </div>
    );
}

export default Login;
