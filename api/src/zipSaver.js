import archiver from 'archiver';
import _ from 'lodash';
import path from 'path';
import fs from 'fs';

export default class zipSaver{
    constructor(app, files = [], response){

        this.app = app;
        this.files = files;
        this.response = response;

    }

    save(){

        const app = this.app;
        const files = this.files;
        const uploadDir = app.get('storageDir');
        const response = this.response;
        const output = fs.createWriteStream(uploadDir + '/'+ response +'.zip');
        const archive = archiver('zip', {
            zlib: { level: 9 } 
            });

        output.on('close', () => {
            console.log('Archive finished.');
        });

        archive.on('error', (err) => {
            throw err;
        });

        archive.pipe(output);

        _.each(files, (file) => {
            const filePath = path.join(uploadDir, _.get(file, 'name'));
            console.log(filePath);
            archive.append(fs.createReadStream(filePath), {name: _.get(file, 'originalName')});
        })

        archive.finalize();

        return this;
    }
}