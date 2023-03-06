import _ from 'lodash';
import { userCollect } from './userCollect';
import { uploadUser } from './uploadUser';

export const userExist = () => {

    let storage = Object.keys(sessionStorage);
    let key = storage[2];
    const result = JSON.parse(sessionStorage.getItem(key));
    let email = _.get(result, 'username');

    userCollect(email).then((response) => {
        console.log('typeof data', response.data);
        if(response.data.length === 0){
            console.log('is this repeated twice');
            uploadUser();
        }
    })
}