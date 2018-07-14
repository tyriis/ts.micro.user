import {UserPersistence} from "../persistence/user.persistence";
import {User} from '../model/user';
import {Request} from '../model/request'
import {UserService} from "./user.service";
import {logger} from "../logger";

const ERRORS = require('../errors.json');

export class UserServiceImpl implements UserService {

  /**
   * create a new UserService instance with an existing UserPersistence instance
   * @param {UserPersistence} persistence
   * @param {Request} req
   */
  constructor(private persistence: UserPersistence, private req:Request) { }

  /**
   * create a new user
   * expect email to be a valid email address
   * expect username to be null or not empty string
   * @param {string} email
   * @param {string} username
   * @returns {Promise<User>}
   */
  async create (email: string, username: string): Promise<User> {
    logger.debug(`[user.service.create] > ${JSON.stringify(this.req)}`);
    await this.checkEmail(email);
    if (username) {
      await this.checkUserName(username);
    }
    return await this.persistence.create(email, username);
  }

  /**
   * change the email
   * expect user exist
   * expect user is this.req.user or user has admin role
   * @param {number} id
   * @param {string} email
   * @returns {Promise<User>}
   */
  async changeEmail (id: number, email: string): Promise<User> {
    logger.debug(`[user.service.change.email] {"id": ${id}} > ${JSON.stringify(this.req)}`);
    await this.checkEmail(email);
    let user: User = await this.retrieve(id);
    user.email = email;
    return await this.persistence.update(user);
  }

  /**
   * change the username
   * expect user exist
   * expect user is this.req.user or user has admin role
   * @param {number} id
   * @param {string} username
   * @returns {Promise<User>}
   */
  async changeUserName (id: number, username: string): Promise<User> {
    logger.debug(`[user.service.change.username] {"id": ${id}} > ${JSON.stringify(this.req)}`);
    await this.checkUserName(username, true);
    let user: User = await this.retrieve(id);
    user.username = username;
    return await this.persistence.update(user);
  }

  /**
   * get user by id
   * expect user exist
   * expect user is this.req.user or this.req.user has admin role
   * @param {number} id
   * @returns {Promise<User>}
   */
  async get (id: number): Promise<User> {
    logger.debug(`[user.service.get] {"id": ${id}} > ${JSON.stringify(this.req)}`);
    return await this.retrieve(id);
  }

  /**
   * get all users equal this.req.user (yes only one ~~)
   * get all users if this.req.user has role admin
   * @returns {Promise<Array<User>>}
   */
  async getAll (): Promise<Array<User>> {
    logger.debug(`[user.service.get.all] > ${JSON.stringify(this.req)}`);
    this.checkUser();
    if (this.req.user.roles.indexOf('ADMIN') >= 0) {
      return await this.persistence.getAll();
    }
    return [await this.retrieve(this.req.user.id)];
  }

  /**
   * remove user
   * expect user exist
   * expect user is this.req.user or this.req.user has admin role
   * @param {number} id
   * @returns {Promise<boolean>}
   */
  async remove (id: number): Promise<boolean> {
    logger.debug(`[user.service.close] {"id": ${id}} > ${JSON.stringify(this.req)}`);
    let user: User = await this.retrieve(id);
    return await this.persistence.remove(user).then((id: number) => {
      return id === user.id;
    });
  }

  /**
   * check if user is a valid user
   * @throws Error
   */
  private checkUser():void {
    if (!this.isUser()) {
      logger.error(`[${ERRORS.MISSING_PERMISSION}] > ${JSON.stringify(this.req)}`);
      throw new Error(ERRORS.MISSING_PERMISSION);
    }
  }

  /**
   * true if user is a valid user else false
   * @returns {boolean}
   */
  private isUser():boolean {
    return this.req.user && Number(this.req.user.id) >= 1
      && this.req.user.roles && this.req.user.roles.indexOf('USER') >= 0;
  }

  /**
   * true if user is a valid admin else false
   * @returns {boolean}
   */
  private isAdmin(): boolean {
    return this.isUser() && this.req.user.roles.indexOf('ADMIN') >= 0;
  }

  /**
   * retrueve account by id if allowed
   * @param {number} id
   * @returns {Promise<User>}
   * @throws Error
   */
  private async retrieve(id: number): Promise<User> {
    this.checkUser();
    let user: User = await this.persistence.get(id);
    if (user.id === this.req.user.id || this.isAdmin()) {
      return user;
    }
    logger.error(`[${ERRORS.MISSING_PERMISSION}] > ${JSON.stringify(this.req)}`);
    throw new Error(ERRORS.MISSING_PERMISSION);
  }

  /**
   * check if email is valid
   * @param {string} email
   * @throws Error
   */
  private async checkEmail(email:string): Promise<void> {
    // @link https://stackoverflow.com/a/1373724 for regex explanation
    const re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    if (!re.test(String(email).toLowerCase())) {
      logger.error(`[${ERRORS.INVALID_EMAIL}] > ${JSON.stringify(this.req)}`);
      throw new Error(ERRORS.INVALID_EMAIL);
    }
    let available = await this.persistence.emailAvailable(email);
    if (!available) {
      logger.error(`[${ERRORS.UNAVAILABLE_EMAIL}] > ${JSON.stringify(this.req)}`);
      throw new Error(ERRORS.UNAVAILABLE_EMAIL);
    }
  }

  /**
   * check if username is valid
   * @param {string} username
   * @param {boolean} notNull
   * @throws Error
   */
  private async checkUserName(username: string, notNull?: boolean): Promise<void> {
    // @link https://stackoverflow.com/a/12019115 for regex explanation
    const re = /^(?=.{3,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
    if ((notNull && username === null ) || !re.test(String(username))) {
        logger.error(`[${ERRORS.INVALID_USERNAME}] > ${JSON.stringify(this.req)}`);
        throw new Error(ERRORS.INVALID_USERNAME);
    }
    let available = await this.persistence.usernameAvailable(username);
    if (!available) {
      logger.error(`[${ERRORS.UNAVAILABLE_USERNAME}] > ${JSON.stringify(this.req)}`);
      throw new Error(ERRORS.UNAVAILABLE_USERNAME);
    }
  }

}
