const expect = require('expect');

const {Users} = require('../utils/users');

describe('Test Users class', () => {
    let users;

    beforeEach(() => {
        users = new Users();
        users.users = [{
            id: 1,                  //Input when created: room name
            name: 'anonymous',
            room: 'test room1'
        },{
            id: 2,                  //Input when created: participant name, room name
            name: 'test participant1',
            room: 'test room2'
        },{
            id: 3,                  //Input when created: participant name, room name
            name: 'test participant2',
            room: 'test room1'
        }];
    });
//removeUser getUser getUserList
    it('Test adding a new user', () => {
        let user = {
            id: '3',
            name: 'test participant2',
            room: 'test room3'
        };

        users.addUser(user.id, user.name, user.room);

        expect(users.users[3]).toEqual(user);
    });

    it('Test removing a user', () => {
        expect(users.users.length).toBe(3);

        let user = users.removeUser(1);

        expect(users.users.length).toBe(2);
        expect(user).toBeTruthy();
    });

    it('Test failing to remove a user', () => {
        expect(users.users.length).toBe(3);

        let user = users.removeUser(9);

        expect(users.users.length).toBe(3);
        expect(user).toBeFalsy();
    });

    it('Test finding and returning a user', () => {
        let user = users.getUser(2);

        expect(user.id).toBe(2);
        expect(user.name).toBe('test participant1');
        expect(user.room).toBe('test room2');
    });

    it('Test failing to find a user', () => {
        let user = users.getUser(99);

        expect(user).toBeFalsy();
    });

    it('Test returning the user list', () => {
        let userList = users.getUserList('test room1');

        expect(userList).toEqual(['anonymous', 'test participant2']);
    });
});
