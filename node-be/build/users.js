import R from "ramda";
export class Users {
    constructor() {
        this.users = [];
    }
    join(user) { this.users.push(user); return user; }
    get(id) {
        const user = this.users.find(R.propEq("id", id));
        if (user)
            return user;
        else
            return { id: "", username: "", room: "" };
    }
    remove(id) {
        const user = this.get(id);
        this.users = R.reject(R.propEq("id", id), this.users);
        return user;
    }
    getRoom(room) {
        return { room, users: this.users.filter(R.propEq("room", room)) };
    }
}
export const users = new Users();
//# sourceMappingURL=users.js.map