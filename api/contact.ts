import { neon } from "@neondatabase/serverless";

type ContactSubmission = {
  name?: unknown;
  usn?: unknown;
  phone?: unknown;
  idea?: unknown;
};

export default async function handler(
  request: { method?: string; body?: ContactSubmission },
  response: { status: (code: number) => { json: (body: unknown) => void } },
) {
  if (request.method !== "POST") {
    return response.status(405).json({ error: "Method not allowed." });
  }

  const { name, usn, phone, idea } = request.body ?? {};
  if (![name, usn, phone, idea].every((value) => typeof value === "string" && value.trim())) {
    return response.status(400).json({ error: "Name, USN, phone, and idea are required." });
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return response.status(500).json({ error: "Database is not configured." });
  }

  try {
    const sql = neon(databaseUrl);
    await sql`
      insert into contact_submissions (name, usn, phone, idea)
      values (${name}, ${usn}, ${phone}, ${idea})
    `;
    return response.status(201).json({ ok: true });
  } catch (error) {
    console.error("Could not save contact submission:", error);
    return response.status(500).json({ error: "Could not save your submission." });
  }
}
