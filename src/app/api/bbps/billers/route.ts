import { NextResponse } from "next/server";

const LAMBDA_BASE = (process.env.NEXT_PUBLIC_BBPS_PROXY_URL || "https://4vtfgim3z4.execute-api.ap-south-1.amazonaws.com/dev").replace(/\/$/, "");

export async function POST(request: Request) {
    try {
        const body = await request.json().catch(() => ({}));
        const pageNumber = body?.pagination?.pageNumber ?? 1;
        const recordsPerPage = body?.pagination?.recordsPerPage ?? 50;
        const categoryKey = body?.filters?.categoryKey ?? "C04";

        const res = await fetch(`${LAMBDA_BASE}/bbps/billers`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                pagination: { pageNumber, recordsPerPage },
                filters: { categoryKey },
            }),
            // @ts-ignore
            cache: "no-store",
        });

        const data = await res.json();
        if (!res.ok) {
            return NextResponse.json({ error: data }, { status: res.status });
        }
        return NextResponse.json(data);
    } catch (e: any) {
        return NextResponse.json({ error: e?.message || "Unknown error" }, { status: 500 });
    }
}


