// @flow

import bunyan from "bunyan";
import config from "config";

const infoFileStream = {
  name: "infoFileStream",
  path: "/tmp/log/restify-swagger-boilerplate/info.log",
  level: "info"
};

const infoAuditFileStream = {
  name: "infoAuditFileStream",
  path: "/tmp/log/restify-swagger-boilerplate/info.audit.log",
  level: "info"
};

const errorFileStream = {
  name: "errorFileStream",
  path: "/tmp/log/restify-swagger-boilerplate/error.log",
  level: "warn"
};

const errorAuditFileStream = {
  name: "errorAuditFileStream",
  path: "/tmp/log/restify-swagger-boilerplate/error.audit.log",
  level: "warn"
};

const log = bunyan.createLogger({
  name: "restify-swagger-logger",
  level: config.get("app.log-level")
});

export const auditLog = bunyan.createLogger({
  name: "restify-swagger-audit-logger",
  level: config.get("app.log-level")
});

if (process.env.NODE_ENV !== "development") {
  log.addStream(infoFileStream);
  log.addStream(errorFileStream);
  auditLog.addStream(infoAuditFileStream);
  auditLog.addStream(errorAuditFileStream);
}

export default log;
