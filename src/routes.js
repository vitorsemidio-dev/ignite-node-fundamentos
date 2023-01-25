import { randomUUID } from "crypto";
import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database();

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/users"),
    handler: (req, res) => {
      const { search } = req.query;
      const users = database.select("users", {
        name: search,
        email: search,
      });
      return res.end(JSON.stringify(users));
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/users"),
    handler: (req, res) => {
      const { name, email } = req.body;
      const user = {
        id: randomUUID(),
        name: name,
        email: email,
      };
      database.insert("users", user);
      return res.writeHead(201).end();
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/users/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      const success = database.delete("users", id);
      if (!success) {
        return res.writeHead(400).end();
      }
      return res.writeHead(204).end();
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/users/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      const { name, email } = req.body;
      const success = database.update("users", id, { name, email });
      if (!success) {
        return res.writeHead(400).end();
      }
      return res.writeHead(204).end();
    },
  },
];
