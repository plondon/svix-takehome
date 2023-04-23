import { svix } from "../../utils";

export async function GET(
  request: Request,
  context: { params: { name: string } }
) {
  const { name } = context.params;
  try {
    const result = await svix.eventType.get(name);
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (e: any) {
    const svixError = e.body as SvixErrorType;
    return new Response(JSON.stringify(svixError.detail), { status: e.code });
  }
}
