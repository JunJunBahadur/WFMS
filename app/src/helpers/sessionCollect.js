import _ from 'lodash';

export const sessionCollect = () => {
   /* let mainKey = '';
    
    let storage = Object.keys(sessionStorage);
    _.each(storage, (key)=> {
        let parsedKey = JSON.parse(sessionStorage.getItem(key));
        if('username' in parsedKey){
            mainKey = parsedKey;
        }
    });
    */

    return JSON.parse(localStorage.getItem('login'));
}