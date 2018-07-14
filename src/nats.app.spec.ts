import { expect } from 'chai';
import 'mocha';
import * as NATS from 'nats';
import * as Hemera from 'nats-hemera';
import {RequestGenerator} from "./test/request.generator";

const natsOpts = {
  url: process.env.NATS_URL,
  user: process.env.NATS_USER,
  pass: process.env.NATS_PW,
};
let requestGenerator: RequestGenerator;
let hemera;

describe('App', () => {

  beforeEach(async () => {
    requestGenerator = new RequestGenerator('app-test');
    hemera = new Hemera(NATS.connect(natsOpts), {});
    return await hemera.ready();
  });

  describe('CREATE', () => {
    // TODO: write tests!
    /* it('Should reject if meta$ is not set', (done) => {
      hemera.act({
        topic: 'user',
        cmd: 'CREATE',
        requestId$: requestGenerator.id,
      }, (err, resp) => {
        expect(err).to.be.not.null;
        expect(err.message === 'missing permission').to.be.true;
        expect(resp).to.be.undefined;
        hemera.close(done);
      });
    });*/
    /*it('Should reject if user.roles is not set in meta$', (done) => {
      hemera.act({
        topic: 'account',
        cmd: 'CREATE',
        meta$: {
          id: requestGenerator.id,
          user: {id: 1},
        },
      }, (err, resp) => {
        expect(err).to.be.not.null;
        expect(err.message === 'missing permission').to.be.true;
        expect(resp).to.be.undefined;
        hemera.close(done);
      });
    });
    it('Should reject if role USER is missing', (done) => {
      hemera.act({
          topic: 'account',
          cmd: 'CREATE',
          meta$: {
            id: requestGenerator.id,
            user: {id: 1, roles: ['FOO', 'BAR']},
          },
        }, (err, resp) => {
          expect(err).to.be.not.null;
          expect(err.message === 'missing permission').to.be.true;
          expect(resp).to.be.undefined;
          hemera.close(done);
        }
      )
    });*/
    /*it('Should return a new account if role USER is set', (done) => {
      hemera.act({
        topic: 'account',
        cmd: 'CREATE',
        meta$: requestGenerator.getValid(),
      }, (err, resp) => {
        expect(err).to.be.null;
        expect(resp).to.be.not.undefined;
        expect(resp.data.owner).to.be.equal(1);
        hemera.close(done);
      });
    });*/
  });

  describe('GET.user', () => {
    it('Should reject if meta$ is not set', (done) => {
      hemera.act({
        topic: 'user',
        cmd: 'GET',
        id: 1,
      }, (err, resp) => {
        expect(err).to.be.not.null;
        expect(err.message === 'missing permission').to.be.true;
        expect(resp).to.be.undefined;
        hemera.close(done);
      });
    });
    it('Should reject if user.roles is not set in meta$.user', (done) => {
      hemera.act({
        topic: 'user',
        cmd: 'GET',
        id: 1,
        meta$: {
          id: requestGenerator.id,
          user: {id: 1},
        }
      }, (err, resp) => {
        expect(err).to.be.not.null;
        expect(err.message === 'missing permission').to.be.true;
        expect(resp).to.be.undefined;
        hemera.close(done);
      });
    });
    it('Should reject if role USER is missing', (done) => {
      hemera.act({
        topic: 'user',
        cmd: 'GET',
        id: 1,
        meta$: {
          id: requestGenerator.id,
          user: {id: 1, roles: ['FOO', 'BAR']},
        }
      }, (err, resp) => {
        expect(err).to.be.not.null;
        expect(err.message === 'missing permission').to.be.true;
        expect(resp).to.be.undefined;
        hemera.close(done);
      });
    });
    it('Should return a user if role USER is set', (done) => {
      hemera.act({
        topic: 'user',
        cmd: 'GET',
        id: 1,
        meta$: requestGenerator.getValid(),
      }, (err, resp) => {
        expect(err).to.be.null;
        expect(resp).to.be.not.undefined;
        expect(resp.data.id).to.be.equal(1);
        hemera.close(done);
      });
    });
  });

  describe('GET.all', () => {
    it('Should reject if meta$ is not set', (done) => {
      hemera.act({
        topic: 'user',
        cmd: 'GET.all',
      }, (err, resp) => {
        expect(err).to.be.not.null;
        expect(err.message === 'missing permission').to.be.true;
        expect(resp).to.be.undefined;
        hemera.close(done);
      });
    });
    it('Should reject if user.roles is not set in meta$.user', (done) => {
      hemera.act({
        topic: 'user',
        cmd: 'GET.all',
        meta$: {
          id: requestGenerator.id,
          user: {id: 1},
        }
      }, (err, resp) => {
        expect(err).to.be.not.null;
        expect(err.message === 'missing permission').to.be.true;
        expect(resp).to.be.undefined;
        hemera.close(done);
      });
    });
    it('Should reject if role USER is missing', (done) => {
      hemera.act({
        topic: 'user',
        cmd: 'GET.all',
        meta$: {
          id: requestGenerator.id,
          user: {id: 1, roles: ['FOO', 'BAR']},
        }
      }, (err, resp) => {
        expect(err).to.be.not.null;
        expect(err.message === 'missing permission').to.be.true;
        expect(resp).to.be.undefined;
        hemera.close(done);
      });
    });
    it('Should accept if role USER is set', (done) => {
      hemera.act({
        topic: 'user',
        cmd: 'GET.all',
        meta$: requestGenerator.getValid(),
      }, (err, resp) => {
        let owner = new Set(resp.map(acc => acc.data.owner));
        expect(err).to.be.null;
        expect(resp).to.be.not.undefined;
        expect(owner.size).to.be.equal(1);
        hemera.close(done);
      });
    });
  });

  describe('SET.email', () => {
    it('Should reject if meta$ is not set', (done) => {
      hemera.act({
        topic: 'user',
        cmd: 'SET.email',
        id: 1,
        email: 'foo@bar.com',
      }, (err, resp) => {
        expect(err).to.be.not.null;
        expect(err.message === 'missing permission').to.be.true;
        expect(resp).to.be.undefined;
        hemera.close(done);
      });
    });
    it('Should reject if user.roles is not set in meta$.user', (done) => {
      hemera.act({
        topic: 'user',
        cmd: 'SET.email',
        id: 1,
        email: 'foo@bar.com',
        meta$: {
          id: requestGenerator.id,
          user: {id: 1}
        }
      }, (err, resp) => {
        expect(err).to.be.not.null;
        expect(err.message === 'missing permission').to.be.true;
        expect(resp).to.be.undefined;
        hemera.close(done);
      });
    });
    it('Should reject if role USER is missing', (done) => {
      hemera.act({
        topic: 'user',
        cmd: 'SET.email',
        id: 1,
        email: 'foo@bar.com',
        meta$: {
          id: requestGenerator.id,
          user: {id: 1, roles: ['FOO', 'BAR']},
        }
      }, (err, resp) => {
        expect(err).to.be.not.null;
        expect(err.message === 'missing permission').to.be.true;
        expect(resp).to.be.undefined;
        hemera.close(done);
      });
    });
    it('Should accept if role USER is set', (done) => {
      hemera.act({
        topic: 'user',
        cmd: 'SET.email',
        id: 1,
        email: 'foo@bar.com',
        meta$: requestGenerator.getValid(),
      }, (err, resp) => {
        expect(err).to.be.null;
        expect(resp).to.be.not.undefined;
        expect(resp.data.id).to.be.equal(1);
        hemera.close(done);
      });
    });
  });

  describe('SET.username', () => {
    it('Should reject if meta$ is not set', (done) => {
      hemera.act({
        topic: 'user',
        cmd: 'SET.username',
        id: 1,
        username: 'foo',
      }, (err, resp) => {
        expect(err).to.be.not.null;
        expect(err.message === 'missing permission').to.be.true;
        expect(resp).to.be.undefined;
        hemera.close(done);
      });
    });
    it('Should reject if user.roles is not set in meta$.user', (done) => {
      hemera.act({
        topic: 'user',
        cmd: 'SET.username',
        id: 1,
        username: 'foo',
        meta$: {
          id: requestGenerator.id,
          user: {id: 1},
        }
      }, (err, resp) => {
        expect(err).to.be.not.null;
        expect(err.message === 'missing permission').to.be.true;
        expect(resp).to.be.undefined;
        hemera.close(done);
      });
    });
    it('Should reject if role USER is missing', (done) => {
      hemera.act({
        topic: 'user',
        cmd: 'SET.username',
        id: 1,
        username: 'foo',
        meta$: {
          id: requestGenerator.id,
          user: {id: 1, roles: ['FOO', 'BAR']},
        }
      }, (err, resp) => {
        expect(err).to.be.not.null;
        expect(err.message === 'missing permission').to.be.true;
        expect(resp).to.be.undefined;
        hemera.close(done);
      });
    });
    it('Should accept if role USER is set', (done) => {
      hemera.act({
        topic: 'user',
        cmd: 'SET.username',
        id: 1,
        username: 'foo',
        meta$: requestGenerator.getValid(),
      }, (err, resp) => {
        expect(err).to.be.null;
        expect(resp).to.be.not.undefined;
        expect(resp.data.id).to.be.equal(1);
        hemera.close(done);
      });
    });
  });

  describe('DELETE', () => {
    it('Should reject if meta$ is not set', (done) => {
      hemera.act({
        topic: 'user',
        cmd: 'DELETE',
        id: 1,
      }, (err, resp) => {
        expect(err).to.be.not.null;
        expect(err.message === 'missing permission').to.be.true;
        expect(resp).to.be.undefined;
        hemera.close(done);
      });
    });
    it('Should reject if user.roles is not set in meta$.user', (done) => {
      hemera.act({
        topic: 'user',
        cmd: 'DELETE',
        id: 1,
        meta$: {
          id: requestGenerator.id,
          user: {id: 1},
        }
      }, (err, resp) => {
        expect(err).to.be.not.null;
        expect(err.message === 'missing permission').to.be.true;
        expect(resp).to.be.undefined;
        hemera.close(done);
      });
    });
    it('Should reject if role USER is missing', (done) => {
      hemera.act({
        topic: 'user',
        cmd: 'DELETE',
        id: 1,
        meta$: {
          id: requestGenerator.id,
          user: {id: 1, roles: ['FOO', 'BAR']},
        }
      }, (err, resp) => {
        expect(err).to.be.not.null;
        expect(err.message === 'missing permission').to.be.true;
        expect(resp).to.be.undefined;
        hemera.close(done);
      });
    });
    it('Should accept if role USER is set', (done) => {
      const email = `test-${Date.now()}@test.com`;
      const username = `test-${Date.now()}`;
      hemera.act({
        topic: 'user',
        cmd: 'CREATE',
        email: email,
        username: username,
        meta$: {
          id: requestGenerator.id,
          user: {id: 22, roles: ['USER']},
        },
      }, (err, resp) => {
        let id = resp.data.id;
        hemera.act({
          topic: 'user',
          cmd: 'DELETE',
          id: id,
          meta$: {
            id: requestGenerator.id,
            user: {id: id, roles: ['USER']},
          }
        }, (err, resp) => {
          expect(err).to.be.null;
          expect(resp).to.be.not.undefined;
          expect(resp).to.be.true;
          hemera.close(done);
        });
      });
    });
    it('Should reject if different user', (done) => {
      const email = `test-${Date.now()}@test.com`;
      const username = `test-${Date.now()}`;
      hemera.act({
        topic: 'user',
        cmd: 'CREATE',
        email: email,
        username: username,
        meta$: {
          id: requestGenerator.id,
          user: {id: 22, roles: ['USER']},
        },
      }, (err, resp) => {
        let id = resp.data.id;
        hemera.act({
          topic: 'user',
          cmd: 'DELETE',
          id: id,
          meta$: requestGenerator.getValid(),
        }, (err, resp) => {
          expect(err).to.be.not.null;
          expect(err.message === 'missing permission').to.be.true;
          expect(resp).to.be.undefined;
          hemera.close(done);
        });
      });
    });
    it('Should accept if different user has role ADMIN', (done) => {
      const email = `test-${Date.now()}@test.com`;
      const username = `test-${Date.now()}`;
      hemera.act({
        topic: 'user',
        cmd: 'CREATE',
        email: email,
        username: username,
        meta$: {
          id: requestGenerator.id,
          user: {id: 22, roles: ['USER']},
        },
      }, (err, resp) => {
        let id = resp.data.id;
        hemera.act({
          topic: 'user',
          cmd: 'DELETE',
          id: id,
          meta$: {
            id: requestGenerator.id,
            user: {id: 23, roles: ['USER', 'ADMIN']},
          },
        }, (err, resp) => {
          expect(err).to.be.null;
          expect(resp).to.be.not.undefined;
          expect(resp).to.be.true;
          hemera.close(done);
        });
      });
    });
  });
});
