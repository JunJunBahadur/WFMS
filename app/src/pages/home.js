import React, {Component} from 'react';
import Header from '../component/header';
import HomeForm from '../component/home-form';
import HomeUploading from '../component/home-uploading';
import HomeUploadSent from '../component/home-upload-sent';
import HomeInbox from '../component/home-inbox';
import HomeViewFile from '../component/home-view-file';
import _ from 'lodash';

class Home extends Component{

    constructor(props){
        super(props);

        this.state = {
            componentName: 'HomeIndex',
            data: null,
            uploadEvent: null
        }

        this._setLoginDetails = this._setLoginDetails.bind(this);
        this._renderComponent = this._renderComponent.bind(this);
    }

    _setLoginDetails(){
        let storage = Object.keys(sessionStorage);
        _.each(storage, (key)=> {
            let parsedKey = JSON.parse(sessionStorage.getItem(key));
            
            if('username' in parsedKey){
                localStorage.setItem('login', JSON.stringify(parsedKey));
            }
        });
    }

    _renderComponent(){
        const {componentName, data, uploadEvent}= this.state;

        switch(componentName){

            case 'HomeUploading':

                return <HomeUploading event={uploadEvent} data={data} />

            case 'HomeUploadSent':

                return <HomeUploadSent onSendAnotherFile={() => {
                    this.setState({
                        componentName: 'HomeForm'
                    })
                }} data={data} />

            case 'HomeForm':

                return <HomeForm 
                    onUploadEvent={(event)=>{
                        
                        let data = this.state.data;
                        if(_.get(event, 'type') === 'success'){
                            data = _.get(event, 'payload');
                        }
                        this.setState({
                            data:data,
                            uploadEvent: event,
                            componentName: (_.get(event, 'type')==='success') ? 'HomeUploadSent': this.state.componentName,
                            });
                    }}

                    onUploadBegin={(data)=>{
                        this.setState({
                            data: data,
                            componentName: 'HomeUploading',
                        });
                    }} />

            case 'HomeViewFile':

                return <HomeViewFile data={data} />
                

            default:
                
                return <HomeInbox 
                    onViewPost={(data)=>{
                        this.setState({
                            data: data,
                            componentName: 'HomeViewFile',
                        });
                    }}
                />
                
        }
    }

    render(){
        this._setLoginDetails();
        return (
            <div className="app-container">
                <Header 
                    toSendForm={()=>{
                        this.setState({
                            componentName: 'HomeForm'
                        })
                    }}

                    toInbox={()=>{
                        this.setState({
                            componentName: ''
                        })
                    }}
                    
                />
                <div className="app-content">
                    {
                        this._renderComponent()
                    }
                </div>
            </div>
        )
    }
}

//{this._renderComponent()}
export default Home