import path from 'path';
import {version} from '../package.json';
import _ from 'lodash';
import File from './models/file';
import { ObjectId } from 'mongodb';
import Post from './models/post';
import User from './models/user';
import FileArchiver from './archiver';
//import Email from './email';


class AppRouter {
    constructor(app) {
        this.app = app;
        this.setupRouters();
    }

    setupRouters(){
        const app = this.app;
        const db = app.get('db');
        const uploadDir = app.get('storageDir');
        const upload = app.get('upload');

        //root routing
        app.get('/', (req,res) => {
            return res.status(200).json({
                version: version
            })
        });

        //Upload
        app.post('/api/upload', upload.array('files'),(req, res) => {
            const files = _.get(req, 'files', []);

            let fileModels = [];

            _.each(files, (fileObject) => {
                const newFile = new File(app).initWithObject(fileObject).toJSON();
                fileModels.push(newFile);
            });

            if(fileModels.length){
                db.collection('files').insertMany(fileModels, (err, result) => {
                    if(err){
                        return res.status(503).json({
                            error: {message: "Unable to save your file."}
                        });
                    }

                    console.log('User request via api upload with data', req.body, result);

                    let post = new Post(app).initWithObject({
                        from: _.get(req, 'body.from'),
                        to: _.get(req, 'body.to'),
                        message: _.get(req, 'body.message'),
                        files: result.insertedIds,
                    }).toJSON();

                    //let save post to posts collection.

                    db.collection('posts').insertOne(post, (err) => {
                        if(err){
                            return res.status(503).json({error: {message: "Your upload could not be saved."}});
                        }
                       
                        return res.json(post);
                    });

                });
            }else{
                return res.status(503).json({
                    error: {message: "File Upload is required."}
                });
            }
        });

        app.post('/api/user', (req, res) => {
                console.log("req at router:",req.body);
                let user = new User(app).initWithObject({
                    email: _.get(req, 'body.email'),
                    name: _.get(req, 'body.name'),
                    isStudent: _.get(req, 'body.isStudent')
                }).toJSON();

                //let save post to posts collection.

                db.collection('user').insertOne(user, (err) => {
                    if(err){
                        return res.status(503).json({error: {message: "Your upload could not be saved."}});
                    }
                    
                    return res.json(user);
                });
        });

        //Download
        app.get('/api/download/:id', (req, res) => {
            const fileId = new ObjectId(req.params.id);

            console.log(fileId);
            db.collection('files').find({_id: fileId}).toArray((err, result) => {
                console.log(result)
                const fileName = _.get(result, '[0].name');
                console.log('fielname:', fileName)
                if(err || !fileName){
                    return res.status(404).json({
                        error: {
                            message: "File not found.1"
                        }
                    })
                }

                //console.log("Find file object from db", err, result);
                
                const filePath = path.join(uploadDir, fileName);
                console.log('hree?',_.get(result, '[0].originalName'))

                return res.download(filePath, _.get(result, '[0].originalName'), (err) => {
                    if(err){
                        return res.status(404).json({
                            error: {
                                message: err
                            }
                        });
                    }else{
                        console.log("File downloaded.");
                    }
                });
            })
        });

        //Routing for user existance
        app.get('/api/user/:email', (req, res) => {
            const email = _.get(req, 'params.email');
            this.getUserByEmail(email, (err, result) => {
                if(err){
                    return res.status(404).json({error:{message: "File not found."}});
                }

                return res.json(result);
            })

        })

        //Routing for emails received
        app.get('/api/inbox/:user', (req, res) => {
            const user = _.get(req, 'params.user');
            this.getPostByEmail(user, (err, result) => {
                if(err){
                    return res.status(404).json({error:{message: "File not found."}});
                }

                return res.json(result);
            })

        })

        //Routing for post detail /api/posts/:id
        app.get('/api/posts/:id', (req,res) => {
            const postId = _.get(req, 'params.id');
            
            this.getPostById(postId, (err, result) => {
                if(err){
                    return res.status(404).json({error:{message: "File not found."}});
                }

                return res.json(result);
            })

        });

        // Routing Download zip files.
        app.get('/api/posts/:id/download',(req,res) => {

            const id = _.get(req, 'params.id', null);
            
            this.getPostById(id, (err, result) => {
                if(err){
                    return res.status(404).json({error:{message: "File not found."}});
                }

                const files  = _.get(result, 'files', []);
                const archiver = new FileArchiver(app, files, res).download();

                return archiver;
            })
        });
    }

    getUserByEmail(emailId, callback = () => {}){
        const app = this.app;
        const db = app.get('db');

        let postEmail = String(emailId);

        db.collection('user').find({email: postEmail}).toArray((err, results) => {

            if(err || !results){
                return callback(err ? err : new Error("File not found."));
            }
            return callback(null, results);
        });
    }

    getPostByEmail(email, callback = () => {}){
        const app = this.app;
        const db = app.get('db');

        let postEmail = String(email);

        db.collection('posts').find({to: postEmail}).toArray((err, results) => {

            if(err || !results){
                return callback(err ? err : new Error("File not found."));
            }
            return callback(null, results);
        });
    }

    getPostById(id, callback = () => {}){

        const app = this.app;

        const db = app.get('db');
        let postObjectId = null;
        try{
            postObjectId = new ObjectId(id);
        }
        catch(err){
            return callback(err, null);
        }

        db.collection('posts').find({_id: postObjectId}).limit(1).toArray((err, results) => {
            let result = _.get(results, '[0]');

            if(err || !result){
                return callback(err ? err : new Error("File not found."));
            }

            const fileIds = _.get(result, 'files', []);

            db.collection('files').find({_id: {$in: Object.values(fileIds)}}).toArray((err,files) => {

                if(err || !files || !files.length){
                    return callback(err ? err : new Error("File not found."));
                }

                result.files = files;
                return callback(null, result);
            });
        });
    }
}

export default AppRouter;