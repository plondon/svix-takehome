import { Svix } from "svix";

export const svix = new Svix(process.env.SVIX_API_KEY || '')