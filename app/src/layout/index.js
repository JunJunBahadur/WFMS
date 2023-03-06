import { Component } from "react";
import Home from "../pages/home";
import View from "../pages/view";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  
import { config } from '../config';
import { PublicClientApplication } from '@azure/msal-browser'; 
import { userExist } from "../helpers/userExist";

class Layout extends Component{
    
    constructor(props){
        super(props);
        this.state = {
            error: null,
            isAuthenticated: false,
            user: {}
          };

        this.login = this.login.bind(this);

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

    async login(){
        try {
          await this.PublicClientApplication.loginPopup(
            {
                scopes: config.scopes,
                prompt: "select_account"
            });
            this.setState({isAuthenticated:true});
            userExist();

        }
        catch(err){
            this.setState({
                isAuthenticated: false,
                user: {},
                error: err
            });
        }
    }
     
    logout(){
    this.PublicClientApplication.logoutPopup(); //!
    }

    render(){
        return(
            <Router>
                <div className="app-layout">
                {
                    (this.state.isAuthenticated || localStorage.getItem('login'))? <div>
                        {
                            
                        }
                            <Routes>
                                <Route exact path='/' element={<Home />} />
                                <Route exact path='/share/:id' element={<View />} />
                            </Routes>
                        </div>: 
                        <p>
                            <button onClick={() => this.login()} > Login </button>
                        </p>
                }
                </div>
            </Router>
        )
    }
}

export default Layout