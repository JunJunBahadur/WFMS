import axios from 'axios';
import { apiUrl } from '../config';
import _ from 'lodash';
import { sessionCollect } from './sessionCollect';

function getStatus(email){
    const removeDomain = email.split("@");
    const removeDots = removeDomain[0].split('.');
    const dept = removeDots[removeDots.length-1];
    return /\d/.test(dept);
}

export function uploadUser(callback = () => {}) {
    const url = `${apiUrl}/user`;

    const result = sessionCollect();

    const email = _.get(result, 'username');
    const name = _.get(result, 'name');

    let isStudent = getStatus(email);

    let data = {
        email: email,
        name: name,
        isStudent: isStudent
    }

    

    console.log("data at uploadUser:",data);
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

