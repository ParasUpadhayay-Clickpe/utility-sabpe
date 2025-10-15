import { NextResponse } from "next/server";

const BASE_URL = "https://api.instantpay.in";

function buildHeaders() {
    const clientId = process.env.ACCESS || "";
    const clientSecret = process.env.SECRET || "";
    const outletId = process.env.OUTLETID || "";
    const endpointIp = process.env.ENDPOINT_IP || "127.0.0.1";

    return {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Ipay-Auth-Code": "1",
        "X-Ipay-Client-Id": clientId,
        "X-Ipay-Client-Secret": clientSecret,
        "X-Ipay-Endpoint-Ip": endpointIp,
        "X-Ipay-Outlet-Id": outletId,
    } as Record<string, string>;
}

export async function POST(request: Request) {
    try {
        const body = await request.json().catch(() => ({}));
        const pageNumber = body?.pagination?.pageNumber ?? 1;
        const recordsPerPage = body?.pagination?.recordsPerPage ?? 50;
        const categoryKey = body?.filters?.categoryKey ?? "C11";

        const res = await fetch(`${BASE_URL}/marketplace/utilityPayments/billers`, {
            method: "POST",
            headers: buildHeaders(),
            body: JSON.stringify({
                pagination: { pageNumber, recordsPerPage },
                filters: { categoryKey, updatedAfterDate: "" },
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


