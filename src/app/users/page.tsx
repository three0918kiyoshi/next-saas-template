import Link from "next/link";
import UserClient from "./UserClient";

export default function UsersPage() {
    return (
        <div className="stack">
            <Link href="/">← トップへ戻る</Link>
            <UserClient />
        </div>
    );
}