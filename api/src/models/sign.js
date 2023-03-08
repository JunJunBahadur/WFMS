import _ from 'lodash';

class userSigning{

    constructor(app){

        this.app = app;

        this.model = {
            email: null,
            _id: null,
            created: new Date(),
        }
    }

    initWithObject(obj){
        this.model.email = _.get(obj, 'email');
        this.model._id = _.get(obj, '_id');
        this.model.created = _.get(obj, 'created', new Date());

        return this;
    }

    toJSON(){
        return this.model;
    }
}

export default userSigning;