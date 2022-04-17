/*
 * Title: lib data
 * Description: handle lib for data
 * Author: Amit Samadder (Abir)
 * Date: 17/04/2022
 * Time: 01:43:23
 *
 */

// dependencies
const fs = require('fs');
const path = require('path');

// module scaffolding
const lib = {};

// base directory of the data folder
lib.basedir = path.join(__dirname, '../.data/');

// write data to file
lib.create = (dir, file, data, callback) => {
    fs.open(`${lib.basedir + dir}/${file}.json`, 'wx', (err, fileDescriber) => {
        if (!err) {
            // convert data to string
            const stringData = JSON.stringify(data);

            // write data to file and close it
            fs.writeFile(fileDescriber, stringData, (err2) => {
                if (!err2) {
                    fs.close(fileDescriber, (err3) => {
                        if (!err3) {
                            callback(false);
                        } else {
                            callback('Error on closing file');
                        }
                    });
                } else {
                    callback('Error on writing file!');
                }
            });
        } else {
            callback('Could not create new file, file already exists!');
        }
    });
};

// read data from file
lib.read = (dir, file, callback) => {
    fs.readFile(`${`${lib.basedir + dir}/${file}.json`}`, 'utf8', (err, data) => {
        callback(err, data);
    });
};

// update existing file
lib.update = () => {};

// module exports
module.exports = lib;
