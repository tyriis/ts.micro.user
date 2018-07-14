import { expect } from 'chai';
import 'mocha';

import { PgDb } from "pogi";
import {UserPersistenceImpl} from "./user.persistence.impl";
import {UserImpl} from "../model/user.impl";

describe('UserPersistence', () => {
  let pgdb;
  let persistence;
  before(async () => {
    pgdb = await PgDb.connect({
      connectionString: process.env.PG_URL
    });
    persistence =new UserPersistenceImpl(pgdb);
    return await true;
  });

  describe('When create user', () => {
    it('Should return a new user with email and name passed', async () => {
      const uuid = Date.now();
      const email = `test${uuid}@test.com`;
      const name = `test${uuid}`;
      const user = await persistence.create(email, name);
      expect(user.email).to.be.equal(email);
      expect(user.username).to.be.equal(name);
      return await true;
    });
    it('Should accept if username is null', async () => {
      const uuid = Date.now();
      const email = `test${uuid}@test.com`;
      const user = await persistence.create(email, null);
      expect(user.email).to.be.equal(email);
      expect(user.username).to.be.null;
      return await true;
    });
    it('Should reject with error if email is null', async () => {
      return await persistence.create(null, null).then(user => {
        expect(typeof user === 'undefined').to.be.true;
      }).catch(err => {
        expect(err.message === 'null value in column "email" violates not-null constraint').to.be.true;
        expect(err.name === 'error').to.be.true;
      });
    });
    it('Should reject with error if email contains less then 3 chars', async () => {
      await persistence.create('ab').then(user => {
        expect(typeof user === 'undefined').to.be.true;
      }).catch(err => {
        expect(err.message === 'new row for relation "users" violates check constraint "users_email_min_length_ck"').to.be.true;
        expect(err.name === 'error').to.be.true;
      });
      return await true;
    });
  });

  describe('When deleting user', () => {
    it('Should return the id of the user deleted', async () => {
      const uuid = Date.now();
      const email = `test${uuid}@test.com`;
      const name = `test${uuid}`;
      const user = await persistence.create(email, name);
      let id = user.id;
      let result = await persistence.remove(user);
      expect(id).to.be.equal(result);
      return await true;
    });
    it('Should reject if user id does not exist', async () => {
      const uuid = Date.now();
      const email = `test${uuid}@test.com`;
      const name = `test${uuid}`;
      const user = await persistence.create(email, name);
      await persistence.remove(user);
      return await persistence.remove(user).then(user => {
        expect(typeof user === 'undefined').to.be.true;
      }).catch(err => {
        expect(err.name === 'Error').to.be.true;
        expect(err.message === 'user does not exist').to.be.true;
      });
    });
    it('Should delete user from database', async () => {
      const uuid = Date.now();
      const email = `test${uuid}@test.com`;
      const name = `test${uuid}`;
      const user = await persistence.create(email, name);
      const id = user.id;
      await persistence.remove(user);
      await pgdb.queryFirst(
        'SELECT * FROM users WHERE id = :id',
        { id },
      ).then(user => {
        expect(typeof user === 'undefined').to.be.true;
      }).catch(err => {
        expect(typeof err === 'undefined').to.be.true;
      });
      return await true;
    });
  });

  describe('When retrieving user', () => {
    it('Should retrieve an existing user', async() => {
      const uuid = Date.now();
      const email = `test${uuid}@test.com`;
      const name = `test${uuid}`;
      let user = await persistence.create(email, name);
      const id = user.id;
      let result = await persistence.get(id);
      expect(result.id).to.be.equal(id);
      expect(result.created.getTime()).to.be.equal(user.created.getTime());
      return await true;
    });
    it('Should not retrieve an not existing account', async() => {
      const uuid = Date.now();
      const email = `test${uuid}@test.com`;
      const name = `test${uuid}`;
      let user = await persistence.create(email, name);
      const id = user.id;
      await persistence.get(id + 1).then(user => {
        expect(typeof user === 'undefined').to.be.true;
      }).catch(err => {
        expect(err.name === 'Error').to.be.true;
        expect(err.message === 'user does not exist');
      });
      await persistence.get(null).then(user => {
        expect(typeof user === 'undefined').to.be.true;
      }).catch(err => {
        expect(err.name === 'Error').to.be.true;
        expect(err.message === 'user does not exist');
      });
      await persistence.get(undefined).then(user => {
        expect(typeof user === 'undefined').to.be.true;
      }).catch(err => {
        expect(err.name === 'Error').to.be.true;
        expect(err.message === 'user does not exist');
      });
      await persistence.get(0).then(user => {
        expect(typeof user === 'undefined').to.be.true;
      }).catch(err => {
        expect(err.name === 'Error').to.be.true;
        expect(err.message === 'user does not exist');
      });
      await persistence.get(-1).then(user => {
        expect(typeof user === 'undefined').to.be.true;
      }).catch(err => {
        expect(err.name === 'Error').to.be.true;
        expect(err.message === 'user does not exist');
      });
      return await true;
    });
  });

  describe('When updating account', () => {
    it('Should update modified on username update', async () => {
      const uuid = Date.now();
      const email = `test${uuid}@test.com`;
      const name = `test${uuid}`;
      let user = await persistence.create(email, name);
      const id = user.id;
      const modified = user.modified.getTime();
      user.username = `${name}-modified`;
      user = await persistence.update(user);
      expect(user.id).to.be.equal(id);
      expect(user.modified.getTime()).to.be.greaterThan(modified);
      expect(user.username).to.be.equal(`${name}-modified`);
      return await true;
    });
    it('Should not store new id in database', async () => {
      const uuid = Date.now();
      const email = `test${uuid}@test.com`;
      const name = `test${uuid}`;
      let user = await persistence.create(email, name);
      user = JSON.parse(JSON.stringify(user)).data;
      user.id = user.id + 1;
      await persistence.update(user).then(user => {
        expect(typeof user === 'undefined').to.be.true;
      }).catch(err => {
        expect(err.name === 'Error').to.be.true;
        expect(err.message === 'user does not exist').to.be.true;
      });
      return await true;
    });
    it('Should not store other then username or email', async () => {
      const uuid = Date.now();
      const email = `test${uuid}@test.com`;
      const name = `test${uuid}`;
      let user = await persistence.create(email, name);
      const created = user.created;
      const modified = user.modified;
      const id = user.id;
      let result = await persistence.update(new UserImpl({
        id, email: user.email, username: user.username, created: new Date(), modified: new Date()
      }));
      expect(result.created.getTime()).to.be.equal(created.getTime());
      expect(result.modified.getTime()).to.be.greaterThan(modified.getTime());
      return await true;
    });
  });

  describe('When retrieving all users', () => {
    it('Should return an array of all users', async () => {
      let uuid = Date.now();
      let email = `test${uuid}@test.com`;
      let name = `test${uuid}`;
      await persistence.create(email, name);
      uuid = Date.now();
      email = `test${uuid}@test.com`;
      name = `test${uuid}`;
      await persistence.create(email, name);
      uuid = Date.now();
      email = `test${uuid}@test.com`;
      name = `test${uuid}`;
      await persistence.create(email, name);
      let users = await persistence.getAll();
      let ids = new Set(users.map(account => account.id));
      expect(ids.size).to.be.greaterThan(2);
      return await true;
    });
  });
});
