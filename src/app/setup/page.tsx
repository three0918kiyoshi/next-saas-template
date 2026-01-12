import Link from "next/link";

const steps = [
    "1. .env.example をコピーして .env を作成",
    "2. docker compose でPostgresを起動",
    "3. npm install",
    "4. npm run db:migrate",
    "5. npm run dev",
];

export default function SetupPage() {
    return (
        <div className="stack">
            <section className="card stack">
                <h2>セットアップ手順</h2>
                <ol>
                    {steps.map((step) => (
                        <li key={step}>{step}</li>
                    ))}
                </ol>
                <p>
                    詳細は README.md を参照してください。Vercel / VPS 用の手順もまとめています。
                </p>
                <Link href="/">トップへ戻る →</Link>
            </section>
        </div>
    );
}
