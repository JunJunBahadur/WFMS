import axios from 'axios';
import { apiUrl } from '../config';
import _ from 'lodash';


export const upload = (form, callback = () => {}) => {
    const url = `${apiUrl}/upload`;
    let files = _.get(form, 'files', []);
    let toArray = _.get(form, 'to', []);
    let to = {};
    let i = 0;
    _.each(toArray, (t) => {
        to[i]=t;
        i=i+1;
    })
    to[i+1]='';

    let data = new FormData();

    _.each(files, (file) => {
        data.append('files', file);
    });

    _.each(to, (eachTo) => {
        data.append('to', eachTo);
    });
    const signer = 0;
    //data.append('to', _.get(form, 'to'));
    data.append('from', _.get(form, 'from'));
    data.append('message', _.get(form, 'message'));
    data.append('signer', signer);
    data.append('subject', _.get(form, 'subject'));

    const config = {
        onUploadProgress: (event) => {

            console.log('event: ',event);
            return callback({
                type: 'onUploadProgress',
                payload: event,
            })
        }
    }

    axios.post(url, data, config).then((response) => {
        console.log('AFTER UPLOAD DATA RESPONSE',response.data._id);
        const url = `${apiUrl}/posts/${response.data._id}/save`;
        axios.get(url);
        //upload successfull.
        return callback({
            type: 'success',
            payload: response.data
        });
    }).catch((err) => {
        return callback({
            type: 'error',
            payload: err
        })
    });
};