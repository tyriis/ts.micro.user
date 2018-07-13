import { User } from "../model/user";

export interface UserPersistence {

  /**
   * retrieve user by id
   * expect valid user.id
   * @param {number} id
   * @returns {Promise<User>}
   */
  get(id: number): Promise<User>;

  /**
   * retrieve all accounts
   * @returns {Promise<Array<User>>}
   */
  getAll(): Promise<Array<User>>;

  /**
   * create a new user
   * @returns {Promise<User>}
   */
  create(email: string, name: string): Promise<User>;

  /**
   * update an existing user or reject
   * expect valid user.id
   * @param {User} user
   * @returns {Promise<User>}
   */
  update(user: User): Promise<User>;

  /**
   * remove an existing user or reject
   * expect valid user.id
   * @param {User} user
   * @returns {Promise<number>}
   */
  remove(user: User): Promise<number>;

}
