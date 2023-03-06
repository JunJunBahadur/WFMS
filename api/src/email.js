import _ from 'lodash';
import { url } from './config';

class Email {
    constructor(app){
        this.app = app;
    }

    sendDownloadLink(post, callback = () => {}){

        const app = this.app;
        const email = app.email;

        const from = _.get(post, 'from');
        const to = _.get(post, 'to');
        const message = _.get(post, 'message', '');
        const postId = _.get(post, '_id');
        const downloadLink = `${url}/share/${postId}`;


        let messageOptions = {
            from: from,
            to: to,
            subject: '[Share] Download Invitation',
            text: message,
            html: `<p>${from} has sent you a file. Click <a href="${downloadLink}">here</a> to download.</p>`
        }

        email.sendMail(messageOptions, (err, info) => {
            return callback(err, info);
        });
    }
}

export default Email;