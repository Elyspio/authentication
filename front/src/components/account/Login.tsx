import React from 'react';
import './Login.scss'
import {Button, Paper, Snackbar, TextField, Typography} from "@material-ui/core";
import {Alert} from "@material-ui/lab";
import {AccountApi} from "../../services/authentication";


interface Props {
    onAuthorized?: Function,
    onForbidden?: Function,
}


function Login(props: Props) {

    const [open, setOpen] = React.useState(false);
    const [token, setToken] = React.useState("");
    const [password, setMdp] = React.useState("")
    const [name, setName] = React.useState("")
    const [snack, setSnack] = React.useState({
        open: false,
        message: "",
        severity: ""
    });

    const submit = async () => {

        let authorisation = await AccountApi.instance.isAuthorized({name, password});
        if (authorisation.success) {

            if (props.onAuthorized) {
                props.onAuthorized();
            }

            setSnack({
                ...snack,
                open: true,
                message: `OK, token ${authorisation.token}`,
                severity: "success"
            })

            setToken(authorisation.token as string);
        } else {
            setSnack({
                ...snack,
                open: true,
                message: "Vous n'êtes pas autorisé à faire cette action",
                severity: "error"
            })

            if (props.onForbidden) {
                props.onForbidden();
            }
        }

        setOpen(false);
        setMdp("")
        // setName("")
    }

    const isValid = async () => {

        let authorisation = await AccountApi.instance.isValid(token);
        if (authorisation.success) {
            setSnack({
                ...snack,
                open: true,
                message: `OK, token ${authorisation.token}`,
                severity: "success"
            })
        } else {
            setSnack({
                ...snack,
                open: true,
                message: "Vous n'êtes pas autorisé à faire cette action",
                severity: "error"
            })

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
                onChange={e => setMdp(e.target.value)}/>

            <Button color={"primary"} type={"submit"} onClick={submit}>Submit</Button>

        </Paper>
    );

    return (
        <div className={"login"}>
            {body}

            <Snackbar open={snack.open} autoHideDuration={6000} onClose={() => setSnack({...snack, open: false})} anchorOrigin={{horizontal: "center", vertical: "bottom"}}>
                <Alert onClose={() => setSnack({...snack, open: false})} severity={snack.severity as any}>
                    {snack.message}
                </Alert>
            </Snackbar>


            <Button onClick={isValid}>IsValid</Button>

        </div>
    );
}

export default Login;
