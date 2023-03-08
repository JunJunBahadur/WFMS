import React, { Component } from 'react';
import _, { get } from 'lodash';
import { getInboxInfo } from '../helpers/inboxCollect';
import { apiUrl } from '../config';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import { userCollect } from '../helpers/userCollect';
import { uploadUser } from '../helpers/uploadUser';
import { sessionCollect } from '../helpers/sessionCollect';

function WithNavigate(props) {
    let navigate = useNavigate();
    return <HomeInbox {...props} navigate={navigate} />
}

class HomeInbox extends Component{

    constructor(props){
        super(props);

        this.state = {
            user: {},
            post: null
        }

        this.onSendRequest = this.onSendRequest.bind(this);
        this.getName = this.getName.bind(this);
    }

    onSendRequest(data) {
        if(this.props.onViewPost){
            this.props.onViewPost(data);
        }
    }

    getName(email){
        return this.state.user[email];
    }

    componentDidMount(){
        const result = sessionCollect();
        let email = result['username'];
        let userNames = this.state.user;
        
        getInboxInfo(email).then((response) => {
            this.setState({
                post: {..._.get(response, 'data')}
            });

            _.each(response.data, (post) => {
                console.log('response at component mount',post.from);
                userCollect(post.from).then((response) => {
                    console.log('response at component mount and user collect:',response.data);
                    userNames[post.from]=response.data[0].name;

                    this.setState({
                        user: {...userNames}
                    })
                }).catch((err)=>{
                    console.log("Error fetching data: ", err);
                });
            })
        }).catch((err)=>{
            console.log("Error fetching data: ", err);
        });
    }
    
    render(){
        const { post, user } = this.state;
        console.log('user', user);
        let files = [];
        let i = 0;
        console.log('Post at Home inbox:');
        _.each(post, (p) => {
            files.push(_.get(post,i,[]));
            i = i+1
            console.log(p);
        });

        return(
            <div className='app-page-download'>
                <div className='app-card app-card-download'>
                    <div className='app-card-content'>
                        <div className='app-card-content-inner'>
                            <div className='app-card-inbox-header'>
                                <h1>Inbox</h1>
                            </div>
                            <div className='app-inbox-file-list'>
                                {
                                    files.map((file, index) => {
                                        return(
                                            <div key={index} className='app-inbox-file-list-item'>
                                                <div className='username'>{user[_.get(file, 'from')]}</div>
                                                <div className='subject'>{_.get(file, 'subject')}</div>
                                                <button onClick={()=>{
                                                    this.onSendRequest(_.get(file, '_id'));
                                                    }} className="app-button primary" type="button">View Files</button>
                                            </div>
                                        )
                                    })                            
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

HomeInbox.propTypes = {
    onViewPost: PropTypes.func
};

export default WithNavigate;