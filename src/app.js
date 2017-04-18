import restify from 'restify';
import SwaggerRestify from 'swagger-restify-mw';
import config from 'config';
import pjson from '../package.json';
import specResolver from './api/swagger/resolver';

const server = restify.createServer({
  name: 'restify-server',
  version: pjson.version
});

specResolver()
  .then(spec => {
    const swaggerConfig = {
      appRoot: process.env.NODE_ENV === 'production' ? 'build' : 'src',
      swagger: spec
    };

    SwaggerRestify.create(swaggerConfig, (err, swaggerRestify) => {
      if (err) throw err;

      swaggerRestify.register(server);

      server.listen(config.get('app.port'), () => {
        console.log('%s:%s listening at  %s', server.name, pjson.version, server.url);
      });
    });
    return true;
  })
  .catch(err => {
    throw err;
  });
