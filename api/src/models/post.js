import _ from 'lodash';

class Post{

    constructor(app){

        this.app = app;

        this.model = {
            from: null,
            to: [],
            toSignatures: [],
            message: null,
            signer: 0,
            subject: null,
            files: [],
            created: new Date(),
        }
    }

    initWithObject(obj){
        this.model.from = _.get(obj, 'from');
        this.model.to = _.get(obj, 'to', []);
        this.model.message = _.get(obj, 'message');
        this.model.subject = _.get(obj, 'subject');
        this.model.files = _.get(obj, 'files', []);
        this.model.created = _.get(obj, 'created', new Date());

        return this;
    }

    toJSON(){
        return this.model;
    }
}

export default Post;