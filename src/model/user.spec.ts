import { expect } from 'chai';
import 'mocha';
import { User } from './user'
import { UserImpl } from "./user.impl";

describe('User', () => {
  const email: string = 'test@test.com';
  describe('When create', () => {
    it('Should have an email', () => {
      const user: User = new UserImpl({email});
      expect(user.email).to.be.equal(email);
    });
  });
  describe('When set member', () => {
    it('Should not allow to set id', () => {
      const user: User = new UserImpl({email});
      expect(() => user[`${'id'}`] = 23).to.throw(Error);
    });
    it('Should not allow to set id', () => {
      const user: User = new UserImpl({email});
      expect(() => user[`${'created'}`] = new Date()).to.throw(Error);
    });
    it('Should not allow to set updated', () => {
      const user: User = new UserImpl({email});
      expect(() => user[`${'modified'}`] = new Date()).to.throw(Error);
    });
    it('Should allow to set name', () => {
      const user: User = new UserImpl({email});
      expect(() => user.name = 'test').to.not.throw();
      expect(user.name).to.be.equal('test');
    });
    it('Should allow to set email', () => {
      const user: User = new UserImpl({email});
      expect(() => user.email = 'user@test.com').to.not.throw();
      expect(user.email).to.be.equal('user@test.com');
    });
  });
});
