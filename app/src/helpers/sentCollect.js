import axios from 'axios';
import _ from 'lodash';
import {apiUrl} from '../config';

export const getSentInfo = (email) => {
    console.log('Email at helper sentCollect:',email);
    const url = `${apiUrl}/sent/${email}`;
    return axios.get(url);
}