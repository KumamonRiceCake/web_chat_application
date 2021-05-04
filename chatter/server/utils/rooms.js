class Rooms {
    constructor () {
        this.rooms = [];
    }

    addRoom(name, password) {
        let room = {
            name: name,
            password: password,
            participants: 1
        };
        this.rooms.push(room);
        return room;
    }

    removeRoom(name) {
        let removedRoom = this.getRoom(name);

        if (removedRoom) {
            this.rooms = this.rooms.filter((room) => {
                return room.name !== name;
            });
        }

        return removedRoom;
    }

    getRoom(name) {
        let room = this.rooms.filter((room) => {
            return room.name === name;
        });

        return room[0];
    }

    getRoomList() {
        return this.rooms;
    }

    increment(name) {
        let removedRoom = this.removeRoom(name);

        removedRoom.participants++;
        this.rooms.push(removedRoom);
    }

    decrement(name) {
        let removedRoom = this.removeRoom(name);

        removedRoom.participants--;
        this.rooms.push(removedRoom);
    }

    isValid(name, password) {
        let room = this.getRoom(name);

        return room.password === password;
    }
}

module.exports = {Rooms};