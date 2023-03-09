import React, {Component} from 'react';
import { useParams } from 'react-router-dom';
import _ from 'lodash';
import { getDownloadInfo } from '../helpers/download';
import { apiUrl } from '../config';

import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import { userSign } from '../helpers/userSign';

function WithNavigate(props) {
    let navigate = useNavigate();
    return <HomeViewStatus {...props} navigate={navigate} />
}

class HomeViewStatus extends Component{
    constructor(props){
        super(props);

        this.state = {
            post: null,
            data: null
        }
    }

    componentDidMount(){
        const {data} = this.props;
        console.log('id from props',data)
        getDownloadInfo(data).then((response) => {

            this.setState({
                post: _.get(response, 'data')
            });
            
        }).catch((err)=>{
            console.log("Error fetching data: ", err);
        })
    }


    render(){
        const { post } = this.state;
        const to = _.get(post, 'to', []);
        to.pop();
        console.log('typeof',typeof(to),'value',post);
        const postId = _.get(post, '_id', null);
        const signer = _.get(post, 'signer', null);

        console.log('Signer:',signer,' To length:',to.length);
        return(
            <div className="app-page-download">
                <div className='app-card app-card-download'>
                    <div className='app-card-content'>
                        <div className='app-card-content-inner'>
                            <div className='app-status-icon'>
                                {
                                    signer < to.length ? <i className='icon-dot-3' /> : <i className='icon-check' />
                                } 
                            </div>

                            <div className='app-download-message app-text-center'>
                                <h2>Your status</h2>
                                <ul>
                                    <li>{signer} Approved</li>
                                    <li>Expires in 30 days</li>
                                </ul>
                            </div>
                            <div className='app-download-file-list'>
                                {
                                    to.map((file, index) => {
                                        return(
                                            <div key={index} className='app-download-file-list-item'>
                                                <div className='filename'>{file}</div>
                                                <div className='download-action'>{
                                                    index < signer ? <div>Approved</div> : <div>Not yet Approved</div>
                                                }</div>
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

HomeViewStatus.propTypes = {
    data: PropTypes.string
}

export default WithNavigate;
//export default withParams(View);
/*

signer 1 => to[0] has signed
signer 2 => to[1] has signed
signer 3 => to[2] has signed
signer 3 => to[3] has not signed


*/