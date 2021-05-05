class Users {
    constructor () {
        this.users = [];
    }

    addUser(id, name, room) {
        let user = {
          id: id,
          name: name,
          room: room
        };
        this.users.push(user);
    }

    removeUser(id) {
        let removedUser = this.getUser(id);

        if(removedUser){
          this.users = this.users.filter((user) => {
            return user.id !== id;
          });
        }

        return removedUser;
    }

    getUser(id) {
        let user = this.users.filter((user) => {
          return user.id === id;
        });

        return user[0];
    }

    getUserList(room){
        let users = this.users.filter((user) => {
          return user.room === room;
        });

        let namesArray = users.map((user) => {
          return user.name;
        });

        return namesArray;
    }
}

module.exports = {Users};