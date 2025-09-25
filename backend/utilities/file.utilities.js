exports.deleteFile = (filePath) => {
    const fs = require('fs');
    fs.unlinkSync(filePath);
}