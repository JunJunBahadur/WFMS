import React, { Component } from 'react';
import _ from 'lodash';
import { getSentInfo } from '../helpers/sentCollect';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { sessionCollect } from '../helpers/sessionCollect';

function WithNavigate(props) {
    let navigate = useNavigate();
    return <HomeSent {...props} navigate={navigate} />
}

class HomeSent extends Component{

    constructor(props){
        super(props);

        this.state = {
            user: '',
            posts: null
        }

        this.onSendRequest = this.onSendRequest.bind(this);
    }

    onSendRequest(data) {
        if(this.props.onViewStatus){
            this.props.onViewStatus(data);
        }
    }

    componentDidMount(){
        const result = sessionCollect();
        let email = result['username'];

        getSentInfo(email).then((response) => {
            this.setState({
                posts: {..._.get(response, 'data')}
            });
            
        }).catch((err)=>{
            console.log("Error fetching data: ", err);
        });
    }
    
    render(){
        const { posts } = this.state;
        let post = [];
        let i = 0;
        console.log('Posts at Home inbox:');
        _.each(posts, (p) => {
            post.push(_.get(posts,i,[]));
            i = i+1
            console.log(p);
        })
        
        return(
            <div className='app-page-download'>
                <div className='app-card app-card-download'>
                    <div className='app-card-content'>
                        <div className='app-card-content-inner'>
                            <div className='app-card-inbox-header'>
                                <h1>Sent</h1>
                            </div>
                            <div className='app-sent-file-list'>
                                {
                                    post.map((p, index) => {
                                        return(
                                            <div key={index} className='app-sent-file-list-item'>
                                                <div className='subject'>{_.get(p, 'subject')}</div>
                                                <button onClick={()=>{
                                                    this.onSendRequest(_.get(p, '_id'));
                                                    }} className="app-button primary" type="button">View Status</button>
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

HomeSent.propTypes = {
    onViewStatus: PropTypes.func
};

export default WithNavigate;