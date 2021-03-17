import React from 'react';
import {Button} from "@material-ui/core";
import {Services} from "../../../core/services";
import {toast} from "react-toastify";

function Debug() {

    const isValid = async () => {
        let {success} = await Services.authentication.isValid();
        if (success) {
            toast.success("OK")

        } else {
            toast.error("Vous n'êtes pas autorisé à faire cette action")
        }
    }

    return (
        <div>
            <Button onClick={isValid}>IsValid</Button>
        </div>
    );
}

export default Debug;
