import axios from 'axios';
import _ from 'lodash';
import {apiUrl} from '../config';

export const getInboxInfo = (email) => {
    console.log('Email at helper:',email);
    const url = `${apiUrl}/inbox/${email}`;
    return axios.get(url);
}