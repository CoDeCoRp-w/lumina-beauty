import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Lumina Beauty - Sistema de Gestión para Salones de Belleza";
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = "image/png";

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: "linear-gradient(135deg, #faf5f0 0%, #f5e6d3 100%)",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "system-ui, sans-serif",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 20,
                        marginBottom: 40,
                    }}
                >
                    <div
                        style={{
                            width: 80,
                            height: 80,
                            background: "linear-gradient(135deg, #d4af37 0%, #c9a961 100%)",
                            borderRadius: 20,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 48,
                        }}
                    >
                        ✂️
                    </div>
                    <h1
                        style={{
                            fontSize: 72,
                            fontWeight: "bold",
                            color: "#2d2d2d",
                            margin: 0,
                        }}
                    >
                        Lumina Beauty
                    </h1>
                </div>
                <p
                    style={{
                        fontSize: 36,
                        color: "#6b6b6b",
                        textAlign: "center",
                        maxWidth: 900,
                        margin: 0,
                    }}
                >
                    Sistema Profesional de Gestión para Salones de Belleza
                </p>
            </div>
        ),
        {
            ...size,
        }
    );
}
