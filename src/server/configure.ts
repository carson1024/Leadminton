import express, { Express, Request, Response, NextFunction } from "express";

export const viteServerBefore = (server: Express) => {
  console.log("VITEJS SERVER");
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));
};

export const viteServerAfter = (server: Express) => {
  const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof Error) {
      res.writeHead(403, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err.message }));
    } else {
      next(err);
    }
  };
  server.use(errorHandler);
};

// ServerHook
export const serverBefore = (server: Express) => {
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));
};

export const serverAfter = (server: Express) => {
  const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof Error) {
      res.status(403).json({ error: err.message });
    } else {
      next(err);
    }
  };
  server.use(errorHandler);
};