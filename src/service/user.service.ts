import {UserPersistence} from "../persistence/user.persistence";
import {User} from '../model/user';
// import {Request} from '../model/request'

export interface UserService {

  /**
   * create a new UserService instance with an existing UserPersistence instance
   * @param {UserPersistence} persistence
   * @param {Request} req
   */
  // new(persistence: AccountPersistence, req:Request);

  /**
   * create a new user
   * expect email to be a valid email address
   * expect username to be null or not empty string
   * @param {string} email
   * @param {string} username
   * @returns {Promise<User>}
   */
  create(email: string, username: string): Promise<User>

  /**
   * get all users equal this.req.user (yes only one ~~)
   * get all users if this.req.user has role admin
   * @returns {Promise<Array<User>>}
   */
  getAll(): Promise<Array<User>>;

  /**
   * get user by id
   * expect user exist
   * expect user is this.req.user or this.req.user has admin role
   * @param {number} id
   * @returns {Promise<User>}
   */
  get(id: number): Promise<User>;

  /**
   * remove user
   * expect user exist
   * expect user is this.req.user or this.req.user has admin role
   * @param {number} id
   * @returns {Promise<boolean>}
   */
  remove(id: number): Promise<boolean>;

  /**
   * change the username
   * expect user exist
   * expect user is this.req.user or user has admin role
   * @param {number} id
   * @param {string} username
   * @returns {Promise<User>}
   */
  changeUserName(id: number, username: string): Promise<User>;

  /**
   * change the email
   * expect user exist
   * expect user is this.req.user or user has admin role
   * @param {number} id
   * @param {string} email
   * @returns {Promise<User>}
   */
  changeEmail(id: number, email: string): Promise<User>;

}
