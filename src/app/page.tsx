import Link from "next/link";

export default function HomePage() {
    return (
        <div className="stack">
            <section className="card stack">
                <h2>スターターキットへようこそ</h2>
                <p>
                    Next.js (App Router) + Prisma + Postgres 構成の最低限の機能を用意しています。
                </p>
                <div className="stack">
                    <Link href="/setup">セットアップ手順を見る →</Link>
                    <Link href="/users">ユーザー管理画面へ →</Link>
                </div>
            </section>
            <section className="card stack">
                <h3>用意済みのAPI</h3>
                <ul>
                    <li>GET /api/health</li>
                    <li>GET /api/users</li>
                    <li>POST /api/users</li>
                </ul>
            </section>
        </div>
    );
}
