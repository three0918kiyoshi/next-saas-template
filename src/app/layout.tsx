import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
    title: "Next SaaS Template",
    description: "Next.js + Prisma + Postgres starter kit",
};

export default function RootLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <html lang="ja">
            <body>
                <div className="container">
                    <header className="header">
                        <h1>Next SaaS Template</h1>
                    </header>
                    <main>{children}</main>
                </div>
            </body>
        </html>
    );
}
