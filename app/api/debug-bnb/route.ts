import { NextResponse } from "next/server";

export async function GET() {
    const accountId = process.env.BNB_ACCOUNT_ID;
    const authorizationId = process.env.BNB_AUTH_ID;
    const authUrl = process.env.BNB_AUTH_URL || "http://test.bnb.com.bo/ClientAuthentication.API/api/v1";

    const results = [];

    // Variation 1: Standard (as currently implemented)
    try {
        const res = await fetch(`${authUrl}/auth/token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ accountId, authorizationId }),
        });
        const text = await res.text();
        results.push({ name: "Standard (camelCase)", status: res.status, response: text });
    } catch (e: any) {
        results.push({ name: "Standard (camelCase)", error: e.message });
    }

    // Variation 2: PascalCase (AccountId)
    try {
        const res = await fetch(`${authUrl}/auth/token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ AccountId: accountId, AuthorizationId: authorizationId }),
        });
        const text = await res.text();
        results.push({ name: "PascalCase (AccountId)", status: res.status, response: text });
    } catch (e: any) {
        results.push({ name: "PascalCase (AccountId)", error: e.message });
    }

    // Variation 3: HTTPS (if original was HTTP)
    if (authUrl.startsWith("http://")) {
        const httpsUrl = authUrl.replace("http://", "https://");
        try {
            const res = await fetch(`${httpsUrl}/auth/token`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ accountId, authorizationId }),
            });
            const text = await res.text();
            results.push({ name: "HTTPS Variant", status: res.status, response: text });
        } catch (e: any) {
            results.push({ name: "HTTPS Variant", error: e.message });
        }
    }

    // Variation 5: Enterprise TransferQR (Based on user docs)
    const entUrl = "http://bnbapideveloperv1.azurewebsites.net";
    const entPayload = {
        "userKey": "e8k7crKA9S0:APA91bGDZ76NccQkYXIzS5", // Example from docs
        "sourceAccountNumber": "1520468087",
        "destinationAccountNumber": "1520468060",
        "currency": "2003", // 2003 usually might be wrong for BOB (usually 1 or BOB), but docs say 2003
        "ammount": "10", // Docs typo "ammount"
        "amount": "10", // Trying correct spelling too just in case
        "reference": "TEST DEBUG",
        "onlyUse": "false"
    };

    try {
        const res = await fetch(`${entUrl}/Enterprise/TransferQR`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(entPayload),
        });
        const text = await res.text();
        results.push({ name: "/Enterprise/TransferQR (Doc Example)", status: res.status, response: text.substring(0, 200) });
    } catch (e: any) {
        results.push({ name: "/Enterprise/TransferQR", error: e.message });
    }

    return NextResponse.json({
        summary: "BNB Auth Diagnostic",
        credentials_used: {
            accountId: accountId,
            authId: authorizationId
        },
        results
    }, { status: 200 });
}
