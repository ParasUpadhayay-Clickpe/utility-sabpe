import { NextResponse } from "next/server";

const BASE_URL = "https://api.instantpay.in";

function extractClientIp(request: Request) {
    const xForwardedFor = request.headers.get("x-forwarded-for") || "";
    const xRealIp = request.headers.get("x-real-ip") || "";
    const ipFromXff = xForwardedFor.split(",")[0]?.trim();
    return ipFromXff || xRealIp || process.env.ENDPOINT_IP || "127.0.0.1";
}

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
        const body = await request.json();
        const { billerId, inputParameters, externalRef, transactionAmount } = body || {};
        if (!billerId || !inputParameters || !externalRef) {
            return NextResponse.json({ error: "billerId, inputParameters, externalRef are required" }, { status: 400 });
        }

        const res = await fetch(`${BASE_URL}/marketplace/utilityPayments/prePaymentEnquiry`, {
            method: "POST",
            headers: buildHeaders(),
            body: JSON.stringify({
                billerId,
                initChannel: "AGT",
                externalRef,
                inputParameters,
                deviceInfo: { ip: "0.0.0.0", mac: "BC-BE-33-65-E6-AC" },
                remarks: {
                    param1: 9999999999
                },
                transactionAmount: transactionAmount ?? 0,
            }),
            cache: "no-store",
        });
        const data = await res.json();
        if (!res.ok) return NextResponse.json({ error: data }, { status: res.status });
        return NextResponse.json(data);
    } catch (e: any) {
        return NextResponse.json({ error: e?.message || "Unknown error" }, { status: 500 });
    }
}


