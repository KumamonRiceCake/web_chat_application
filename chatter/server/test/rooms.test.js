const expect = require('expect');

const {Rooms} = require('../utils/rooms');

describe('Test Rooms class', () => {
    let rooms;

    beforeEach(() => {
        rooms = new Rooms();
        rooms.rooms = [{
            name: 'testRoom1',   //Input when created: room name
            password: '',
            participants: 1
        },{
            name: 'testRoom2',   //Input when created: room name, password
            password: 'testPassword1',
            participants: 2
        }];
    });

    it('Test adding a new room', () => {
        let room = {
            name: 'testRoom3',
            password: 'testPassword2',
            participants: 1
        };

        rooms.addRoom(room.name, room.password);

        expect(rooms.rooms[2]).toEqual(room);
    });

    it('Test removing a room', () => {
        expect(rooms.rooms.length).toBe(2);
        let room = rooms.removeRoom('testRoom1');

        expect(rooms.rooms.length).toBe(1);
        expect(room).toBeTruthy();
    });

    it('Test failing to remove a room', () => {
        let room = rooms.removeRoom('non-existent room');

        expect(rooms.rooms.length).toBe(2);
        expect(room).toBeFalsy();
    });

    it('Test finding and returning a room', () => {
        let room = rooms.getRoom('testRoom2');

        expect(room.name).toBe('testRoom2');
        expect(room.password).toBe('testPassword1');
        expect(room.participants).toBe(2);
    });

    it('Test failing to find a room', () => {
        let room = rooms.getRoom('non-existent room');

        expect(room).toBeFalsy();
    });

    it('Test returning the room list', () => {
        let roomList = rooms.getRoomList();

        expect(roomList).toBe(rooms.rooms);
    });

    it('Test incrementing the number of participant in a room', () => {
        expect(rooms.getRoom('testRoom2').participants).toBe(2);

        rooms.increment('testRoom2');

        expect(rooms.getRoom('testRoom2').participants).toBe(3);
    });

    it('Test decrementing the number of participant in a room', () => {
        expect(rooms.getRoom('testRoom2').participants).toBe(2);

        rooms.decrement('testRoom2');

        expect(rooms.getRoom('testRoom2').participants).toBe(1);
    });

    it('Test password validation returns true', () => {
        let validation = rooms.isValid('testRoom2', 'testPassword1')

        expect(validation).toBe(true);
    });

    it('Test password validation returns false', () => {
        let validation = rooms.isValid('testRoom2', 'wrongPassword')

        expect(validation).toBe(false);
    });
});
