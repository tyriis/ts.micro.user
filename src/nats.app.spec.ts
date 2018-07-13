/*import * as NATS from 'nats';
import * as Hemera from 'nats-hemera';
import * as HemeraJoi from 'hemera-joi'
import {PgDb} from 'pogi';
import {UserPersistence} from "./persistence/user.persistence";
import {UserService} from "./service/user.service";
import {UserServiceImpl} from "./service/user.service.impl";
import {UserPersistenceImpl} from "./persistence/user.persistence.impl";
import {User} from './model/user'
import {Client} from "nats";
import {logger, pogiLogger} from "./logger";

const nats: Client = NATS.connect({
  url: process.env.NATS_URL,
  user: process.env.NATS_USER,
  pass: process.env.NATS_PW,
});
const hemera: Hemera = new Hemera(nats, {
  logLevel: 'info',
  childLogger: true,
  tag: 'hemera-user',
  logger,
});

let persistence: UserPersistence;

(async()=> {
  const pgdb: PgDb = await PgDb.connect({
    connectionString: process.env.PG_URL,
    logger: pogiLogger,
  });
  persistence = new UserPersistenceImpl(pgdb);

  hemera.use(HemeraJoi);

  await hemera.ready();

  const Joi = hemera['joi'];

  hemera.add({
    topic: 'user',
    cmd: 'GET',
    id: Joi.number().required(),
  }, async function(req) {
    let service: UserService = new UserServiceImpl(persistence, this.meta$);
    return await service.get(req.id);
  });

  hemera.add({
    topic: 'user',
    cmd: 'CREATE'
  }, async function(req) {
    let meta = this.meta$;
    let service: UserService = new UserServiceImpl(persistence, meta);
    let user: User = await service.create();
    hemera.act({
      pubsub$: true,
      topic: 'user',
      cmd: 'CREATED',
      user: user,
      meta$: meta,
    });
    return user;
  });

  hemera.add({
    topic: 'user',
    cmd: 'DELETE',
    id: Joi.number().required(),
  }, async function(req) {
    let meta = this.meta$;
    let service: UserService = new UserServiceImpl(persistence, meta);
    return await service.delete(req.id);
  });

  hemera.add({
    topic: 'user',
    cmd: 'GET.all',
  }, async function(req) {
    let service: UserService = new UserServiceImpl(persistence, this.meta$);
    return await service.getAll();
  });

  hemera.add({
    topic: 'user',
    cmd: 'SET.name',
    id: Joi.number().required(),
    value: Joi.string().required(),
  }, async function(req) {
    let service: UserService = new UserServiceImpl(persistence, this.meta$);
    return await service.setName(req.id, req.value);
  });

  hemera.add({
    topic: 'user',
    cmd: 'SET.email',
    id: Joi.number().required(),
    value: Joi.string().required(),
  }, async function(req) {
    let service: UserService = new UserServiceImpl(persistence, this.meta$);
    return await service.changeEmail(req.id, req.value);
  });

})().catch(logger.error);
*/
