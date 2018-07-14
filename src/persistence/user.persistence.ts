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
   * except email to be not null
   * except email to be valid
   * except username to be null or non empty
   * @param {string} email
   * @param {string} username
   * @returns {Promise<User>}
   */
  create(email: string, username: string): Promise<User>;

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
