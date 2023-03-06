import axios from 'axios';
import {apiUrl} from '../config';

export const userCollect = (email) => {
    const url = `${apiUrl}/user/${email}`;
    console.log('Email at helper exist:',url);
    return axios.get(url);
}