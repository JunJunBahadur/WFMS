const production = false;

export const apiUrl = production ? 'http://domain.com/api' : 'http://localhost:3000/api';

export const config = {
    appId: 'ed5adb27-2fa6-439e-afd3-dc2aa5c46660',
    redirectUri: 'http://localhost:3001/',
    scopes: [
        'user.read'
    ],
    authority:'https://login.microsoftonline.com/kct.ac.in'
};