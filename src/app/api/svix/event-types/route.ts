import { Svix } from "svix";
import { svix } from "../utils";

export async function POST(request: Request) {
  const { name, description } = await request.json();

  try {
    const result = await svix.eventType.create({
      name,
      description,
    });
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (e: any) {
    const svixError = e.body as SvixErrorType;
    return new Response(JSON.stringify(svixError.detail), { status: e.code });
  }
}

export async function GET(request: Request) {
  const query = request.url.split("?")[1];
  const params = new URLSearchParams(query);
  const iterator = params.get("iterator") || undefined;

  try {
    const result = await svix.eventType.list({ limit: 10, iterator });
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (e: any) {
    const svixError = e.body as SvixErrorType;
    return new Response(JSON.stringify(svixError.detail), { status: e.code });
  }
}

export async function PATCH(request: Request) {
  const { name, description } = await request.json();

  try {
    const result = await svix.eventType.update(name, {
      description,
    });
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (e: any) {
    const svixError = e.body as SvixErrorType;
    return new Response(JSON.stringify(svixError.detail), { status: e.code });
  }
}
