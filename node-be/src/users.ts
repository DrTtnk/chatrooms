import R from "ramda"

export type User = {
    id: string,
    username: string,
    room: string
}

export class Users {

    users: User[] = [];

    join(user: User) { this.users.push(user); return user; }

    get(id: string) { 
        const user = this.users.find(R.propEq("id", id));
        if(user)
            return user;
        else
            return {id: "", username: "", room: ""};
    }

    remove(id: string) { 
        const user = this.get(id);
        this.users = R.reject(R.propEq("id", id), this.users);
        return user; 
    }

    getRoom(room: string) {
        return { room, users: this.users.filter(R.propEq("room", room)) }
    }
}

export const users = new Users();