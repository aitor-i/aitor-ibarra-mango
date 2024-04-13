import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    const rangeValues = [1.99, 5.99, 10.99, 30.99, 50.99, 70.99];
    const body = { rangeValues };

    return new NextResponse(JSON.stringify(body), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
