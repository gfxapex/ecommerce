import { Request } from "express";

export interface RequestWithUserInterface extends Request {
  user: { 
    id: number; 
    email: string; 
    role: string;
  };
}