const expect = require('expect');
const {generateMessage} = require('../utils/message');

describe('Test generateMessage method', () => {
    it('Test generating a new message', () => {

        let from = 'random participant';
        let text = 'random message';
        let message = generateMessage(from, text);

        expect(message).toMatchObject({
            from: from,
            text: text
        });
        expect(typeof message.timeStamp).toBe('number');
    });
});