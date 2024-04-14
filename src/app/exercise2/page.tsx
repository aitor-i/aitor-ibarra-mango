import React from 'react';

import { Range } from '@/components/Range/Range';
interface Ranges {
    rangeValues: number[];
}

export async function generateMetadata() {
    const endpoint = new URL(process.env.NEXT_PUBLIC_BASE_URL + '/api/get-fixed-range');
    const res = await fetch(endpoint);

    const data: Ranges = res.ok ? await res.json() : {};
    return {
        title: `Range - ${Math.min(...data.rangeValues)} - ${Math.max(...data.rangeValues)}`
    };
}

export default async function page() {
    const endpoint = new URL(process.env.NEXT_PUBLIC_BASE_URL + '/api/get-fixed-range');
    const res = await fetch(endpoint);

    const data: Ranges = res.ok ? await res.json() : {};

    return (
        <div className="justify-center gap-4 flex-col flex px-4 py-32 h-screen alingn-center">
            {res.ok && <Range fixedValues={data.rangeValues} />}
        </div>
    );
}
