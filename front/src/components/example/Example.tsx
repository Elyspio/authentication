import React, {Component} from 'react';
import {RootState} from "../../store/reducer";
import {Dispatch} from "redux";
import {connect, ConnectedProps} from "react-redux";
import {HaproxyApi} from "../../api/example";
import { Container} from "@material-ui/core";
import "./Example.scss"
import { Core } from '../../../../back/core/example/types';

const mapStateToProps = (state: RootState) => ({})

const mapDispatchToProps = (dispatch: Dispatch) => ({})

const connector = connect(mapStateToProps, mapDispatchToProps);
type ReduxTypes = ConnectedProps<typeof connector>;

type State = {
    conf: Core.Config
}

class Haproxy extends Component<ReduxTypes, State> {


    state = {
        
    }



    async componentDidMount() {
        const conf = await HaproxyApi.instance.getConfig();
        this.setState({conf});
    }

    render() {
        return (
            <Container className={"Haproxy"}>
                {JSON.stringify(this.state.conf)}
            </Container>
        );
    }

}


export default connector(Haproxy);
