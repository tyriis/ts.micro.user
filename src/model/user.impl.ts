import {User} from './user'
import {UserData} from "./user.data";

export class UserImpl implements User {

    private data: UserData;

    constructor(userData: UserData) {
        this.data = userData;
    }

    get created(): Date {
        return this.data.created;
    }

    get email(): string {
        return this.data.email;
    }

    set email(email:string) {
        this.data.email = email;
    }

    get id(): number {
        return this.data.id;
    }

    get username(): string {
        return this.data.username;
    }

    set username(name: string) {
        this.data.username = name;
    }

    get modified(): Date {
        return this.data.modified;
    }
}
