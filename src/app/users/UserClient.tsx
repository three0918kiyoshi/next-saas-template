"use client";

import { useEffect, useState } from "react";

type User = {
    id: string;
    email: string;
    name: string;
    createdAt: string;
};

type FormState = {
    email: string;
    name: string;
};

export default function UserClient() {
    const [users, setUsers] = useState<User[]>([]);
    const [form, setForm] = useState<FormState>({ email: "", name: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [notice, setNotice] = useState<string | null>(null);

    const fetchUsers = async () => {
        setError(null);
        try {
            const res = await fetch("/api/users", { cache: "no-store" });
            if (!res.ok) {
                throw new Error("ユーザー一覧の取得に失敗しました。");
            }
            const data = (await res.json()) as User[];
            setUsers(data);
        } catch (fetchError) {
            const message =
                fetchError instanceof Error
                    ? fetchError.message
                    : "ユーザー一覧の取得に失敗しました。";
            setError(message);
        }
    };

    useEffect(() => {
        void fetchUsers();
    }, []);

    const handleChange = (key: keyof FormState, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setNotice(null);

        try {
            const res = await fetch("/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            const payload = (await res.json()) as { message?: string };

            if (!res.ok) {
                throw new Error(payload.message ?? "ユーザー作成に失敗しました。");
            }

            setNotice("ユーザーを追加しました。");
            setForm({ email: "", name: "" });
            await fetchUsers();
        } catch (submitError) {
            const message =
                submitError instanceof Error
                    ? submitError.message
                    : "ユーザー作成に失敗しました。";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="stack">
            <section className="card stack">
                <h2>ユーザー追加</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={form.name}
                        onChange={(event) => handleChange("name", event.target.value)}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={(event) => handleChange("email", event.target.value)}
                        required
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? "送信中..." : "追加"}
                    </button>
                </form>
                {notice ? <p className="notice">{notice}</p> : null}
                {error ? <p className="error">{error}</p> : null}
            </section>

            <section className="card stack">
                <h2>ユーザー一覧</h2>
                <table className="table">
                    <thead>
                        <tr>
                            <th>名前</th>
                            <th>メール</th>
                            <th>作成日</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan={3}>まだユーザーがいません。</td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{new Date(user.createdAt).toLocaleString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </section>
        </div>
    );
}
