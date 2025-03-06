// src/api-server/configure.ts
import express from "express";
var viteServerBefore = (server) => {
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));
};
var viteServerAfter = (server) => {
  const errorHandler = (err, _, res, next) => {
    if (err instanceof Error) {
      res.writeHead(403, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err.message }));
    } else {
      next(err);
    }
  };
  server.use(errorHandler);
};
var serverBefore = (server) => {
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));
};
var serverAfter = (server) => {
  const errorHandler = (error, _, res, next) => {
    if (error instanceof Error) {
      res.status(403).json({ error: error.message });
    } else {
      next(error);
    }
  };
  server.use(errorHandler);
};
var handlerBefore = () => {
};
var handlerAfter = () => {
};
var callbackBefore = (callback) => {
  return callback;
};
var serverListening = () => {
  console.log(`Server Running`);
};
var serverError = (_, error) => {
  console.log(`Server Error: `, error);
};
export {
  callbackBefore,
  handlerAfter,
  handlerBefore,
  serverAfter,
  serverBefore,
  serverError,
  serverListening,
  viteServerAfter,
  viteServerBefore
};
