import React, { Component } from "react";
import _ from 'lodash';
import classNames from 'classnames';
import { upload } from "../helpers/upload";
import PropTypes, { number } from 'prop-types';
import { sessionCollect } from "../helpers/sessionCollect";
import { validate } from "../helpers/validate";


class HomeValidate extends Component{

    constructor(props){
        super(props);

        this.state = {
            counter: 0,
            form: {
                email: '',
                signature: ''
            },
            errors: {
                email: null,
                signature: null,
            }
        }

        this._onTextChange = this._onTextChange.bind(this);
        this._onSubmit = this._onSubmit.bind(this);
    }

    componentDidMount(){
        const result = sessionCollect();
        this.setState({
            form: {
                ...this.state.form,
            }
        });
    }

    _onSubmit(event){
        event.preventDefault();
        console.log('Onsubmit at validate is triggered');
        const data = this.state.form;
        validate(data);
    }

    _onTextChange(event){

        let {form} =  this.state;

        const fieldName = event.target.name;
        const fieldValue = event.target.value;

        form[fieldName] = fieldValue;
        this.setState({form: form})
    }

    render(){
        const {form, counter, errors} = this.state;
        const {files, to} = form;
        return(
            <div className="app-page-download">
            <div className='app-card'>
                <form onSubmit={this._onSubmit}>
                    <div className='app-card-content'>
                        <div className='app-card-content-inner form'>

                            <div className='app-card-content-inner-right'>

                                <div className={classNames("app-form-item", {'error': _.get(errors,'email')})}>
                                    <label htmlFor="email">Email Address</label>
                                    <input onChange={this._onTextChange} value={_.get(form, 'email', '')} name="email" placeholder={_.get(errors, 'email') ? _.get(errors, 'email') : 'Enter email.'} type='text' id='email' />
                                </div>
                                
                                 <div className={classNames("app-form-item", {'error': _.get(errors,'signature')})}>
                                    <label htmlFor="signature">Signature</label>
                                    <input onChange={this._onTextChange} value={_.get(form, 'signature', '')} name="signature" placeholder={_.get(errors, 'signature') ? _.get(errors, 'signature') : 'Enter signature.'} type='text' id='signature' />
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

HomeValidate.propTypes = {
    onUploadBegin: PropTypes.func,
    onUploadEvent: PropTypes.func
};

export default HomeValidate;