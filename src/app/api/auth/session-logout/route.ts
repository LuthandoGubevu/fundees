
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
    try {
        cookies().delete('session');
        return NextResponse.json({ status: 'success' });
    } catch (error) {
        console.error('Session logout error:', error);
        return NextResponse.json({ status: 'error', message: 'Failed to log out' }, { status: 500 });
    }
}
