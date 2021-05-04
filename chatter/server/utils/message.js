const moment = require('moment');

let generateMessage = (from, text) => {
    return {
        from: from,
        text: text,
        timeStamp: moment().valueOf()
    };
};

module.exports = {generateMessage};