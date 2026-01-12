import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type UserInput = {
    email: string;
    name: string;
};

const isNonEmptyString = (value: unknown): value is string =>
    typeof value === "string" && value.trim().length > 0;

const parseUserInput = (value: unknown): UserInput | null => {
    if (!value || typeof value !== "object") {
        return null;
    }

    const record = value as Record<string, unknown>;
    const email = record.email;
    const name = record.name;

    if (!isNonEmptyString(email) || !isNonEmptyString(name)) {
        return null;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName = name.trim();

    if (!/.+@.+/.test(normalizedEmail)) {
        return null;
    }

    return {
        email: normalizedEmail,
        name: normalizedName,
    };
};

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json(
            { message: "ユーザー一覧の取得に失敗しました。" },
            { status: 500 },
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as unknown;
        const input = parseUserInput(body);

        if (!input) {
            return NextResponse.json(
                { message: "入力値が正しくありません。" },
                { status: 400 },
            );
        }

        const user = await prisma.user.create({
            data: {
                email: input.email,
                name: input.name,
            },
        });

        return NextResponse.json(user, { status: 201 });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                return NextResponse.json(
                    { message: "同じメールアドレスのユーザーが存在します。" },
                    { status: 409 },
                );
            }
        }

        return NextResponse.json(
            { message: "ユーザー作成に失敗しました。" },
            { status: 500 },
        );
    }
}
