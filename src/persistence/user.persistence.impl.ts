import {PgDb} from "pogi";
import {User} from "../model/user";
import {UserData} from "../model/user.data";
import {UserPersistence} from "./user.persistence";
import * as fs from "fs";
import {UserImpl} from "../model/user.impl";

const TABLE = 'users';
const MEMBERS = 'id, email, username, created, modified';

export class UserPersistenceImpl implements UserPersistence {

  private db: PgDb;

  constructor(pgdb: PgDb) {
    this.db = pgdb;
    this.init();
  }

  private async init() {
    const sql = fs.readFileSync(`${__dirname}/../db/create.sql`, 'utf-8');
    return await this.db.query(sql);
  }

  /**
   * retrieve user by id
   * @implements UserPersistence
   * @param {number} id
   * @returns {Promise<User>}
   */
  async get(id: number): Promise<User> {
    return await this.db.queryFirst(
      `SELECT ${MEMBERS} FROM ${TABLE} WHERE id = :id`,
      { id },
    ).then((data:UserData) => {
      if (!data) throw Error('user does not exist');
      return new UserImpl(data);
    });
  }

  /**
   * create a new user
   * except email to be not null
   * except email to be valid
   * except username to be null or non empty
   * @implements UserPersistence
   * @param {string} email
   * @param {string} username
   * @returns {Promise<User>}
   */
  async create(email: string, username: string): Promise<User> {
    return await this.db.queryFirst(
      `INSERT INTO ${TABLE} (email, username) VALUES (:email, :username) RETURNING ${MEMBERS}`,
      { email, username },
    ).then((data:UserData) => new UserImpl(data));
  }

  /**
   * update an existing user or reject
   * expect valid user.id
   * @implements UserPersistence
   * @param {User} user
   * @returns {Promise<User>}
   */
  async update(user: User): Promise<User> {
    return await this.db.queryFirst(
      `UPDATE ${TABLE} SET email = :email, username = :username WHERE id = :id RETURNING ${MEMBERS}`,
      user
    ).then((data:UserData) => {
      if (!data) throw Error('user does not exist');
      return new UserImpl(data)
    });
  }

  /**
   * remove an existing user or reject
   * expect valid user.id
   * @implements UserPersistence
   * @param {User} user
   * @returns {Promise<number>}
   */
  async remove(user: User): Promise<number> {
    return await this.db.queryOneField(
      `DELETE FROM ${TABLE} WHERE id = :id RETURNING id`, user
    ).catch(err => {
      if (err.name === 'TypeError') throw new Error('user does not exist');
      throw err;
    });
  }

  /**
   * retrieve all accounts
   * @implements UserPersistence
   * @returns {Promise<Array<User>>}
   */
  async getAll(): Promise<Array<User>> {
    return await this.db.query(
      `SELECT ${MEMBERS} FROM ${TABLE}`
    ).then((results: Array<UserData>) => {
      return results.map(data => new UserImpl(data));
    });
  }

  /**
   * check if the email is already in the database
   * @implements UserPersistence
   * @param {string} email
   * @returns {Promise<boolean>}
   */
  async emailAvailable (email: string): Promise<boolean> {
    return await this.db.queryOneField(
      `SELECT count(id) = 0 FROM ${TABLE} WHERE email = :email`, {email}
    );
  }

  /**
   * check if the username is already in the database
   * @implements UserPersistence
   * @param {string} username
   * @returns {Promise<boolean>}
   */
  async usernameAvailable (username: string): Promise<boolean> {
    return await this.db.queryOneField(
      `SELECT count(id) = 0 FROM ${TABLE} WHERE username = :username`, {username}
    );
  }

}
