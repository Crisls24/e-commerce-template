import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { type, table, record, old_record } = body;

  switch (type) {
    case "INSERT":
      console.log(`New ${table}:`, record);
      break;
    case "UPDATE":
      console.log(`Updated ${table}:`, record);
      break;
    case "DELETE":
      console.log(`Deleted ${table}:`, old_record);
      break;
  }

  return NextResponse.json({ received: true });
}
