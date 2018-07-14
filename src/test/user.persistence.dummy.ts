import {UserPersistence} from "../persistence/user.persistence";
import {User} from "../model/user";
import {UserImpl} from "../model/user.impl";

const dummyUser = {
  id: 1,
  email: 'test@test.com',
  username: 'test',
  created: new Date(),
  modified: new Date(),
};

export class UserPersistenceDummy implements UserPersistence {

  async create (email: string, name: string): Promise<User> {
    return await new UserImpl(dummyUser);
  }

  async get (id: number): Promise<User> {
    return await new UserImpl(dummyUser);
  }

  async getAll (): Promise<Array<User>> {
    return await [new UserImpl(dummyUser)];
  }

  async remove (user: User): Promise<number> {
    return await user.id;
  }

  async update (user: User): Promise<User> {
    return await new UserImpl(dummyUser);
  }

}
