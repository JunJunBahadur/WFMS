import React, { Component } from 'react';
import _ from 'lodash';
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
            user: '',
            post: null
        }

        this.onSendRequest = this.onSendRequest.bind(this);
    }

    onSendRequest(data) {
        if(this.props.onViewPost){
            this.props.onViewPost(data);
        }
    }

    componentDidMount(){
        const result = sessionCollect();
        let email = result['username'];

        getInboxInfo(email).then((response) => {
            this.setState({
                post: {..._.get(response, 'data')}
            });
            
        }).catch((err)=>{
            console.log("Error fetching data: ", err);
        });
    }
    
    render(){
        const { post } = this.state;
        let files = [];
        let i = 0;
        _.each(post, (p) => {
            files.push(_.get(post,i,[]));
            i = i+1
            console.log(p);
        })
        
        return(
            <div className='app-page-download'>
                <div className='app-card app-card-download'>
                    <div className='app-card-content'>
                        <div className='app-card-content-inner'>
                            <div className='app-card-inbox-header'>
                                <h1>Inbox</h1>
                            </div>
                            <div className='app-download-file-list'>
                                {
                                    files.map((file, index) => {
                                        return(
                                            <div key={index} className='app-download-file-list-item'>
                                                <div className='filename'>{_.get(file, 'from')}</div>
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