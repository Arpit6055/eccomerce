const fs = require('fs')

const deleteFile = (filePath) => {
    fs.unlink(filePath, (err) => {
        if (err) {
            console.log({err, msg:`no such ${filePath} file found`});
        }
    });
}

exports.deleteFile = deleteFile