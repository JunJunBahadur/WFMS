import axios from 'axios';
import { apiUrl } from '../config';
import _ from 'lodash';

export function validate(form, callback = () => {}) {
    let email = _.get(form, 'email');
    let signature = _.get(form, 'signature');

    let data = email+' separator '+signature;
    
    console.log("Data at validate helper:",data);
    const url = `${apiUrl}/validate/${data}`;
    return axios.get(url);
};