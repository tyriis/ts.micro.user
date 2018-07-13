import {PgDb} from "pogi";
import {User} from "../model/user";
import {UserData} from "../model/user.data";
import {UserPersistence} from "./user.persistence";
// import {logger} from "../logger";
import * as fs from "fs";
import {UserImpl} from "../model/user.impl";

const TABLE = 'users';

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
      `SELECT id, owner, balance, datetime, negative FROM ${TABLE} WHERE id = :id`,
      { id },
    ).then((data:UserData) => {
      if (!data) throw Error('user does not exist');
      return new UserImpl(data);
    });
  }

  /**
   * create a new user or reject
   * expect unused email
   * expect unused name
   * @implements UserPersistence
   * @returns {Promise<User>}
   */
  async create(email: string, name: string): Promise<User> {
    return await this.db.queryFirst(
      'INSERT INTO users (email, username) VALUES (:email, :name) RETURNING id, email, username, created, modified',
      { email, name },
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
      'UPDATE user SET email = :email, name = :name WHERE id = :id RETURNING id, email, name, datetime, updated',
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
      'DELETE FROM user WHERE id = :id RETURNING id', user
    ).catch(err => {
      if (err.name === 'TypeError') throw new Error('user does not exist');
      throw err;
    });
  }

  async getAll(): Promise<Array<User>> {
    return await this.db.query(
      'SELECT id, email, name, datetime, updated FROM user'
    ).then((results: Array<UserData>) => {
      return results.map(data => new UserImpl(data));
    });
  }

}
