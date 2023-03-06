import React, {Component} from "react";
import PropTypes from 'prop-types';
import _ from 'lodash';
import { useNavigate } from "react-router-dom";
  /*
  function withRouter(Component) {
    function ComponentWithRouterProp(props) {
      let location = useLocation();
      let navigate = useNavigate();
      let params = useParams();
      return (
        <Component
          {...props}
          router={{ location, navigate, params }}
        />
      );
    }
  
    return ComponentWithRouterProp;
}
*/

function WithNavigate(props) {
    let navigate = useNavigate();
    return <HomeUploadSent {...props} navigate={navigate} />
}

class HomeUploadSent extends Component{

    constructor(props){
        super(props);

        this.state = {
            data: null,
        }
    }

    render(){
        

        const {data} = this.props;

        console.log(data);
        const  to = _.get(data, 'to');
        const postId = _.get(data, '_id');

        return(
            <div className='app-card app-card-upload-sent'>
                <div className='app-card-content'>
                    <div className='app-card-content-inner'>
                        <div className="app-home-uploading">
                            <div className="app-home-uploading-icon">
                                <i className="icon-upload-cloud" />
                            </div>
                            <div className="app-upload-sent-message app-text-center">
                                <h2>Files Sent!</h2>
                                <p>We've sent a email to {to} with a download link.</p>
                            </div>

                            <div className="app-upload-sent-action app-form-action">
                                <button onClick={()=>{

                                    this.props.navigate(`/share/${postId}`);
                                }} className="app-button primary" type="button">View File</button>
                                <button onClick={()=>{
                                    if(this.props.onSendAnotherFile){
                                        this.props.onSendAnotherFile(true);
                                    }
                                }} className="app-button" type="button">Send another file</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

HomeUploadSent.propTypes = {
    data: PropTypes.object,
    onSendAnotherFile: PropTypes.func
}
export default WithNavigate;