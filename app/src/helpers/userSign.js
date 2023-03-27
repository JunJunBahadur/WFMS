import axios from 'axios';
import { apiUrl } from '../config';
import _ from 'lodash';
import { sessionCollect } from './sessionCollect';

export function userSign(postID, callback = () => {}) {
    const url = `${apiUrl}/posts/update`;
    const result = sessionCollect();
    const email = _.get(result, 'username');

    let data = {
        email: email,
        _id: postID
    }

    console.log("Data at userSign helper:",data);
    axios.post(url, data).then((response) => {
        
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

