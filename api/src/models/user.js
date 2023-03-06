import _ from 'lodash';

class User{

    constructor(app){

        this.app = app;

        this.model = {
            email: null,
            name: null,
            isStudent: null,
            created: new Date(),
        }
    }

    initWithObject(obj){
        this.model.email = _.get(obj, 'email');
        this.model.name = _.get(obj, 'name');
        this.model.isStudent = _.get(obj, 'isStudent');
        this.model.created = _.get(obj, 'created', new Date());

        return this;
    }

    toJSON(){
        return this.model;
    }
}

export default User;