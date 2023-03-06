import React, {Component} from 'react';
import { useParams } from 'react-router-dom';
import _ from 'lodash';
import { getDownloadInfo } from '../helpers/download';
import { apiUrl } from '../config';
import { betterNumber } from '../helpers/index'
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';

function WithNavigate(props) {
    let navigate = useNavigate();
    return <HomeViewFile {...props} navigate={navigate} />
}

class HomeViewFile extends Component{
    constructor(props){
        super(props);

        this.state = {
            post: null,
            data: null
        }

        this.getTotalDownloadSize = this.getTotalDownloadSize.bind(this);
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

    getTotalDownloadSize(){
        const {post} = this.state;
        let total = 0;

        const files = _.get(post, 'files', []);
        _.each(files, (file)=> {
            total = total + _.get(file, 'size', 0);
        })
        
        return betterNumber(total);
    }

    render(){

        const { post } = this.state;
        const files = _.get(post, 'files', []);
        const postId = _.get(post, '_id', null);
        const totalSize = this.getTotalDownloadSize();

        return(
                <div className='app-card app-card-download'>
                    <div className='app-card-content'>
                        <div className='app-card-content-inner'>
                            <div className='app-download-icon'>
                                <i className='icon-download' />
                            </div>

                            <div className='app-download-message app-text-center'>
                                <h2>Ready to download</h2>
                                <ul>
                                    <li>{files.length} files</li>
                                    <li>{totalSize}</li>
                                    <li>Expires in 30 days</li>
                                </ul>
                            </div>
                            <div className='app-download-file-list'>
                                {
                                    files.map((file, index) => {
                                        return(
                                            <div key={index} className='app-download-file-list-item'>
                                                <div className='filename'>{_.get(file, 'originalName')}</div>
                                                <div className='download-action'><a href={`${apiUrl}/download/${_.get(file, '_id')}`}>Download</a></div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            
                            <div className='app-download-action app-form-action'>
                                <a href={`${apiUrl}/posts/${postId}/download`} className='app-button primary' >Download All</a>
                                <button className='app-button' type='button'>Share</button>
                            </div>
                        </div>
                    </div>
                </div>
        )
    }
}

HomeViewFile.propTypes = {
    data: PropTypes.string
}

export default WithNavigate;
//export default withParams(View);