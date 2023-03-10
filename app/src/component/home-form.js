import React, { Component } from "react";
import _ from 'lodash';
import classNames from 'classnames';
import { upload } from "../helpers/upload";
import PropTypes, { number } from 'prop-types';
import { sessionCollect } from "../helpers/sessionCollect";


class HomeForm extends Component{

    constructor(props){
        super(props);

        this.state = {
            counter: 0,
            form: {
                files: [],
                to: [],
                numberOfTo: 0,
                from: '',
                subject: '',
                message: ''
            },
            errors: {
                to: null,
                from: null,
                message: null,
                subject: null,
                files: null
            }
        }

        this._onTextChange = this._onTextChange.bind(this);
        this._onSubmit = this._onSubmit.bind(this);
        this._formValidation = this._formValidation.bind(this);
        this._onFileAdded = this._onFileAdded.bind(this);
        this._onFileRemove = this._onFileRemove.bind(this);
        this._onAddingTo = this._onAddingTo.bind(this);
        this._onTextChangeForTo = this._onTextChangeForTo.bind(this);
    }

    componentDidMount(){
        const result = sessionCollect();
        this.setState({
            form: {
                ...this.state.form,
                from: result['username']
            }
        });
    }

    _onAddingTo(){
        let {counter} = this.state;
        const newCount = counter + 1;
        this.setState({
            counter: newCount
        })
    }
    
    _onFileRemove(key){
        let {files} = this.state.form;
        files.splice(key, 1);

        this.setState({
            form: {
                ...this.state.form,
                files: files
            }
        })
    }

    _onFileAdded(event){
        let files = _.get(this.state, 'form.files', []);

        _.each(_.get(event, 'target.files'), (file) => {
            files.push(file);
        });
        
        this.setState({
            form:{
                ...this.state.form,
                files: files,
            }
            }, ()=>{
                this._formValidation(['files'],(isValid)=>{

                });
        });

    }
    _isEmail(emailAddresses){
        // eslint-disable-next-line
        const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        
        console.log('Email validation:',emailAddresses);
        return emailRegex.test(emailAddresses);
    }

    _formValidation(fields = [], callback = () => {}){
        let {form, counter, errors} = this.state;
        
        const validations = {
            from: [
                {
                    errorMessage: 'From is requried.',
                    isValid: () => {
                        return form.from.length;
                    }
                },
                {
                    errorMessage: 'Email is not valid.',
                    isValid: () => {
                        return this._isEmail(form.from);
                    }
                }
            ],
            to: [
                {
                    errorMessage: 'To is requried.',
                    isValid: () => {
                        return form.to.length;
                    }
                },
               /* ADD EMAIL VALIDATION LATER
                    {
                    errorMessage: 'Email is not valid.',
                    isValid: () => {
                        return this._isEmail(form.to);
                    }
                }*/
            ],
            subject: [
                {
                    errorMessage: 'Subject is requried.',
                    isValid: () => {
                        return form.subject.length;
                    }
                }
            ],
            files: [
                {
                    errorMessage: 'File is required',
                    isValid: () => {
                        return form.files.length;
                    }
                }
            ]
        };
        _.each(form.to.length, (count) => {
            console.log('count at validation:',count);
        });
/*  EMAIL VALIDATION
        [...Array(this.state.form.to.length)].forEach((_,i)=>{
            console.log(i);

        });
*/
        _.each(fields, (field) => {
            let fieldValidations = _.get(validations, field, []); 
            
            errors[field] = null;

            _.each(fieldValidations, (fieldValidation) => {
                const isValid = fieldValidation.isValid();
                if(!isValid){
                    errors[field] = fieldValidation.errorMessage;
                }
            });
        });

        this.setState({
            errors: errors
        }, () => {
            let isValid = true;
            _.each(errors, (err) => {
                if(err !== null){
                    isValid = false;
                }
            })
            return callback(isValid);
        });
    }

    _onSubmit(event){
        event.preventDefault();
        this._formValidation(['from','to','files','subject'], (isValid) => {
            
            if(isValid){

                const data = this.state.form;

                if(this.props.onUploadBegin){
                    this.props.onUploadBegin(data);
                }

                upload(data, (event) => {
                    if(this.props.onUploadEvent){
                        this.props.onUploadEvent(event);
                    }
                })
            }
        });
    }

    _onTextChange(event){

        let {form} =  this.state;

        const fieldName = event.target.name;
        const fieldValue = event.target.value;

        form[fieldName] = fieldValue;
        this.setState({form: form})
    }

    _onTextChangeForTo(counter, event){
        let {form} =  this.state;

        const fieldValue = event.target.value;

        let to = _.get(form, 'to');
        to[counter] = fieldValue;
        
        this.setState({form: form})
    }

    render(){
        const {form, counter, errors} = this.state;
        const {files, to} = form;
        return(
            <div className="app-page-download">
            <div className='app-card'>
                <form onSubmit={this._onSubmit}>
                    <div className='app-card-header'>
                        <div className='app-card-header-inner'>    
                            {
                                files.length ? (<div className="app-files-selected">
                                        {
                                            files.map((file,index) => {
                                                return(
                                                    <div key={index} className="app-files-selected-item">
                                                        <div className="filename">{file.name}</div>
                                                        <div className="file-action">
                                                            <button onClick={()=>this._onFileRemove(index)} type={'button'} className="app-file-remove">X</button>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                        </div>) : null          
                            }
                            <div className={classNames("app-file-select-zone",{'error': _.get(errors,'files')},{'smaller': files.length})}>
                                <label id='input-file'>
                                    <input onChange={this._onFileAdded} id='input-file' type='file' multiple={true} />
                                    {
                                        files.length ? <span className="app-upload-description text-uppercase smaller">Add more files</span> : 
                                        <span>
                                            <span className="app-upload-icon"><i className="icon-picture-streamline" /></span>
                                            <span className="app-upload-description">Drag and drop your files here.</span>
                                            <span className="app-button-emulate"><p>Browse</p></span>
                                        </span>
                                    }
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className='app-card-content'>
                        <div className='app-card-content-inner form'>
                            <div className="app-card-content-inner-left">
                                <div className={classNames("app-form-item", {'error': _.get(errors,'to')})}>
                                    <label htmlFor="to">Send to</label>
                                    <input onChange={(event) => this._onTextChangeForTo(0,event)}  name="to" placeholder={_.get(errors, 'to') ? _.get(errors, 'to') : 'Email address'} type='text' id='to' />
                                </div>

                                <div className="app-to-selected">
                                    {

                                        Array.from(Array(counter)).map((c, index) => {
                                            return (
                                                <div key={index} className="app-form-item">
                                                    <input onChange={(event) => this._onTextChangeForTo(index+1,event)} type='text' placeholder={index+1}></input>
                                                </div>
                                            )
                                        })
                                    }
                                    <div className="app-form-item">
                                        <button type="button" onClick={this._onAddingTo}>+Add next signer</button>
                                    </div>
                                </div>
                            </div>

                            <div className='app-card-content-inner-right'>
                                <div className={classNames("app-form-item", {'error': _.get(errors,'subject')})}>
                                    <label htmlFor="subject">Subject</label>
                                    <input onChange={this._onTextChange} value={_.get(form, 'subject', '')} name="subject" placeholder={_.get(errors, 'subject') ? _.get(errors, 'subject') : 'Enter subject of your application.'} type='text' id='subject' />
                                </div>
                                
                                <div className="app-form-item">
                                    <label htmlFor="message">MESSAGE</label>
                                    <textarea onChange={this._onTextChange} value={_.get(form, 'message', '')} placeholder='Add a note (Optional)' id="message" name="message" />
                                </div>

                            </div>
                        </div>
                        <div className="app-form-action">
                            <button type='submit' className="app-button primary">Send</button>
                        </div>
                    </div>
                </form>
            </div>
            </div>
        )
    }
}

HomeForm.propTypes = {
    onUploadBegin: PropTypes.func,
    onUploadEvent: PropTypes.func
};

export default HomeForm;