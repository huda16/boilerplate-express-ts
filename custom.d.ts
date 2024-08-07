import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";

declare module "express-serve-static-core" {
  interface Request {
    auth?: any | JwtPayload;
  }
}

declare global {
  interface Meta {
    current_page: number;
    last_page: number;
    first_page_url: string;
    last_page_url: string;
    links: [];
    path: string;
    prev_page_url: string | null;
    next_page_url: string | null;
    limit: number;
    from: number;
    to: number;
    total: number;
  }
}
