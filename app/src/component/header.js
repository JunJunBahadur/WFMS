import React,{Component} from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import { PublicClientApplication } from '@azure/msal-browser'; 
import { config } from "../config";
import { sessionCollect } from "../helpers/sessionCollect";

function WithNavigate(props) {
    let navigate = useNavigate();
    return <Header {...props} navigate={navigate} />
}

class Header extends Component{
    constructor(props){
        super(props);

        this.state = {
            user: ''
        }

        this.PublicClientApplication  = new PublicClientApplication({
            auth: {
            clientId: config.appId,
            redirectUri: config.redirectUri,
            authority: config.authority 
            },
            cache: {
            cacheLocation: "sessionStorage",
            storeAuthStateInCookie: true
            }
        });
    }

    componentDidMount(){
        //const result = JSON.parse(localStorage.getItem('login'));
        const result = sessionCollect();
        const email = result['username'];
        this.setState({
            user: email
        })
    }
    
    render(){
        const email = this.state.user;
        return(
            <div className="app-header">
                <div className="app-site-info">
                    <h1>Chain Flow</h1>
                    <div className="site-title">Welcome,</div>
                    <div className="site-slogan">{`${email}`}</div>
                    
                </div>
                <div className="app-header-nav-bar">
                    <button onClick={()=>{
                        this.props.toSendForm();
                    }}>Create</button>
                    <button onClick={()=>{
                        this.props.toInbox();
                    }}>Inbox</button>
                    <button onClick={()=>{
                        this.props.toSent();
                    }}>Sent</button>
                    <button onClick={()=>{
                        localStorage.removeItem('login');
                        this.PublicClientApplication.logoutRedirect();
                        window.location.reload();
                        //this.props.navigate(`/`);
                    }} type="button" className="app-button">Logout</button>
                </div>
               
            </div>
        )
    }
}

Header.propTypes = {
    toSendForm: PropTypes.func,
}

export default WithNavigate;