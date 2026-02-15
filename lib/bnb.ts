import { env } from "process";

const BNB_API_URL = process.env.BNB_API_URL || "https://qrsimpleapiv2.azurewebsites.net/api/v1";
const AUTH_API_URL = process.env.BNB_AUTH_URL || "http://test.bnb.com.bo/ClientAuthentication.API/api/v1";

interface BNBTokenResponse {
    success: boolean;
    message: string; // Token is here if success is true
}

interface BNBQRResponse {
    success: boolean;
    message: string;
    id?: string;
    qr?: string; // Likely base64 string or byte array representation
}

interface BNBStatusResponse {
    success: boolean;
    message: string;
    qrId?: number; // 1=No Usado; 2= Usado; 3=Expirado; 4=Error
    expirationDate?: string;
}

export const bnb = {
    /**
     * Authenticates with BNB to get a session token.
     */
    async getToken(): Promise<string> {
        if (process.env.NEXT_PUBLIC_BNB_MOCK_MODE === "true") {
            console.log("BNB MOCK MODE: Returning fake token");
            return "mock-token-12345";
        }

        const accountId = process.env.BNB_ACCOUNT_ID;
        const authorizationId = process.env.BNB_AUTH_ID;

        if (!accountId || !authorizationId) {
            throw new Error(`BNB credentials missing. AccountID: ${!!accountId}, AuthID: ${!!authorizationId}`);
        }

        try {
            console.log("Attempting BNB Auth...", { url: `${AUTH_API_URL}/auth/token` });

            const res = await fetch(`${AUTH_API_URL}/auth/token`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ accountId, authorizationId }),
                cache: "no-store",
                next: { revalidate: 0 }
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`BNB Auth Failed (${res.status}): ${text.substring(0, 100)}`);
            }

            const data: BNBTokenResponse = await res.json();

            if (data.success) {
                return data.message;
            }

            throw new Error(`BNB Auth Logic Failed: ${data.message}`);
        } catch (error: any) {
            throw new Error(`BNB Auth Error: ${error.message}`);
        }
    },

    /**
     * Generates a Simple QR Code.
     */
    async generateQR(amount: number, gloss: string, singleUse: boolean = true) {
        try {
            const token = await this.getToken();

            if (process.env.NEXT_PUBLIC_BNB_MOCK_MODE === "true") {
                console.log("BNB MOCK MODE: Returning fake QR");
                // Returns a simple 1x1 red pixel as base64
                const mockQR = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKwMTQAAAABJRU5ErkJggg==";
                return { success: true, qr: mockQR, id: "mock-qr-id-999" };
            }

            // Expiration: 1 day from now
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const expirationDate = tomorrow.toISOString().split('T')[0]; // YYYY-MM-DD

            const res = await fetch(`${BNB_API_URL}/main/getQRWithImageAsync`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    currency: "BOB",
                    gloss,
                    amount: amount.toString(),
                    singleUse: singleUse ? "true" : "false",
                    expirationDate
                }),
                cache: "no-store"
            });

            if (!res.ok) {
                const text = await res.text();
                return { error: `QR Gen HTTP Error (${res.status}): ${text}` };
            }

            const data = await res.json();
            return data;

        } catch (error: any) {
            console.error("BNB Generate QR Error:", error);
            return { error: error.message || "Unknown Error in GenerateQR" };
        }
    },

    /**
     * Checks the status of a specific QR ID.
     */
    async checkStatus(qrId: string) {
        try {
            const token = await this.getToken();

            if (process.env.NEXT_PUBLIC_BNB_MOCK_MODE === "true") {
                console.log("BNB MOCK MODE: Simulating Paid Status");
                // Simulate success (qrId: 2 means PAID)
                return { success: true, message: "OK", qrId: 2 };
            }

            const res = await fetch(`${BNB_API_URL}/main/getQRStatusAsync`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ qrId }),
            });

            const data: BNBStatusResponse = await res.json();
            return data;

        } catch (error) {
            console.error("BNB Check Status Error:", error);
            return { error: "Connection failed" };
        }
    }
};
