const capitalizeFirst = (str) => {
    if (!str || typeof str !== 'string') return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
const capitalizeWords = (str) => {
    if (!str || typeof str !== 'string') return '';
    return str.split(' ').map(word => capitalizeFirst(word)).join(' ');
}

const generateFileName = (extension) => {
    const crypto = require("crypto");
    return crypto.randomUUID() + "." + extension;
}

module.exports = { 
    capitalizeFirst, 
    capitalizeWords,
    generateFileName
};