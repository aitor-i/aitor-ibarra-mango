import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    const body = { max: 100, min: 1 };

    return new NextResponse(JSON.stringify(body), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
