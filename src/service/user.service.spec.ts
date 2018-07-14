import { expect } from 'chai';
import 'mocha';
import {UserService} from "./user.service";
import {UserServiceImpl} from "./user.service.impl";
import {RequestGenerator} from "../test/request.generator";
import {UserPersistenceDummy} from "../test/user.persistence.dummy";

const ERRORS = require('../errors.json');

describe('AccountService', () => {
  let persistence;
  let requestGenerator: RequestGenerator;
  before(() => {
    persistence = new UserPersistenceDummy();
    requestGenerator = new RequestGenerator('service-test');
  });

  describe('create', () => {
    it('Should accept if role USER is missing', async() => {
      const service: UserService = new UserServiceImpl(persistence, requestGenerator.getInvalid());
      const uuid = Date.now();
      const email = `test${uuid}@test.com`;
      await service.create(email, null).then(user => {
        expect(user).to.be.not.undefined;
      });
    });
    it('Should accept if role USER is set', async() => {
      const service: UserService = new UserServiceImpl(persistence, requestGenerator.getValid());
      const uuid = Date.now();
      const email = `test${uuid}@test.com`;
      await service.create(email, null).then(user => {
        expect(user).to.be.not.undefined;
      });
      return await true;
    });
  });

  describe('getAll', () => {
    it('Should reject if role USER is missing', async () => {
      const service: UserService = new UserServiceImpl(persistence, requestGenerator.getInvalid());
      await service.getAll().then(accounts => {
        expect(false).to.be.true;
      }).catch(err => {
        expect(err.message === ERRORS.MISSING_PERMISSION).to.be.true;
        expect(err.name === 'Error').to.be.true;
      });
      return await true;
    });

    it('Should accept if role USER is set', async () => {
      const service = new UserServiceImpl(persistence, requestGenerator.getValid());
      await service.getAll().then(accounts => {
        expect(accounts).to.be.not.undefined;
        expect(accounts.length === 1).to.be.true;
      }).catch(err => {
        expect(false).to.be.true;
      });
      return await true;
    });
  });

  describe('get', () => {
    it('Should reject if role USER is missing', async () => {
      const service = new UserServiceImpl(persistence, requestGenerator.getInvalid());
      await service.get(1).then(user => {
        expect(false).to.be.true;
      }).catch(err => {
        expect(err.message === ERRORS.MISSING_PERMISSION).to.be.true;
        expect(err.name === 'Error').to.be.true;
      });
      return await true;
    });
    it('Should accept if role USER is set', async () => {
      const service = new UserServiceImpl(persistence, requestGenerator.getValid());
      await service.get(1).then(user => {
        expect(user).not.to.be.undefined;
      }).catch(err => {
        expect(false).to.be.true;
      });
      return await true;
    });
  });


  describe('remove', () => {
    it('Should reject if role USER is missing', async () => {
      const service = new UserServiceImpl(persistence, requestGenerator.getInvalid());
      await service.remove(1).then(result => {
        expect(false).to.be.true;
      }).catch(err => {
        expect(err.message === ERRORS.MISSING_PERMISSION).to.be.true;
        expect(err.name === 'Error').to.be.true;
      });
      return await true;
    });
    it('Should accept if role USER is set', async () => {
      const service = new UserServiceImpl(persistence, requestGenerator.getValid());
      await service.remove(1).then(result => {
        expect(result).not.to.be.undefined;
        expect(result).to.be.true;
      }).catch(err => {
        expect(false).to.be.true;
      });
      return await true;
    });
  });

  describe('changeEmail', () => {
    it('Should reject if role USER is missing', async () => {
      const service = new UserServiceImpl(persistence, requestGenerator.getInvalid());
      await service.changeEmail(1, `test${Date.now()}@test.com`).then(user => {
        expect(false).to.be.true;
      }).catch(err => {
        expect(err.message === ERRORS.MISSING_PERMISSION).to.be.true;
        expect(err.name === 'Error').to.be.true;
      });
      return await true;
    });
    it('Should accept if role USER is set', async () => {
      const service = new UserServiceImpl(persistence, requestGenerator.getValid());
      await service.remove(1).then(result => {
        expect(result).not.to.be.undefined;
        expect(result).to.be.true;
      }).catch(err => {
        expect(false).to.be.true;
      });
      return await true;
    });
  });

  describe('changeUserName', () => {
    it('Should reject if role USER is missing', async () => {
      const service = new UserServiceImpl(persistence, requestGenerator.getInvalid());
      await service.changeUserName(1, `test${Date.now()}`).then(user => {
        expect(false).to.be.true;
      }).catch(err => {
        expect(err.message === ERRORS.MISSING_PERMISSION).to.be.true;
        expect(err.name === 'Error').to.be.true;
      });
      return await true;
    });
    it('Should accept if role USER is set', async () => {
      const service = new UserServiceImpl(persistence, requestGenerator.getValid());
      await service.remove(1).then(result => {
        expect(result).not.to.be.undefined;
        expect(result).to.be.true;
      }).catch(err => {
        expect(false).to.be.true;
      });
      return await true;
    });
  });
});

