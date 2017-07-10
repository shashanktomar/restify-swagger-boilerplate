import restify from "restify";
import SwaggerRestify from "swagger-restify-mw";
import config from "config";
import pjson from "../package.json";
import specResolver from "./api/swagger/resolver";
import logger, { auditLog } from "./logger";

const server = restify.createServer({
  name: "restify-server",
  version: pjson.version,
  log: logger
});

const appPort = config.get("app.port");

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.authorizationParser());
server.use(restify.urlEncodedBodyParser({ mapParams: false }));

server.on("after", (req, res, route, err) => {
  if (req && req.path === "/v1/ping") {
    // Skip auditor logging if its ping request
    return;
  }
  const auditer = restify.auditLogger({ log: auditLog });
  auditer(req, res, route, err);
});

specResolver()
  .then(spec => {
    spec.host = config.get("app.swaggerHost"); // eslint-disable-line
    const swaggerConfig = {
      appRoot: process.env.WATCH ? "src" : "build",
      swagger: spec
    };

    SwaggerRestify.create(swaggerConfig, (err, swaggerRestify) => {
      if (err) throw err;

      swaggerRestify.register(server);

      server.listen(appPort, () => {
        logger.info(
          "Env: %s, %s:%s listening at  %s",
          process.env.NODE_ENV,
          server.name,
          pjson.version,
          appPort
        );
      });
    });
    return true;
  })
  .catch(err => {
    throw err;
  });
