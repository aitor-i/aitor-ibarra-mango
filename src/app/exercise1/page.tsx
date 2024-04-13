import React from 'react';

import { Range } from '@/components/Range/Range';
interface Ranges {
    min: number;
    max: number;
}

export default async function page() {
    const endpoint = new URL(process.env.NEXT_PUBLIC_BASE_URL + '/api/get-range');
    const res = await fetch(endpoint);
    if (!res.ok) throw new Error('Error');
    const data: Ranges = await res.json();

    return (
        <div className="justify-center gap-4 flex-col flex px-4 py-32 h-screen alingn-center">
            <Range max={data.max} min={data.min} />
        </div>
    );
}
