import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request) {
    const token = request.headers.get('Authorization')?.split(' ')[1] || ''; // فرض می‌کنیم توکن به صورت 'Bearer <token>' ارسال می‌شود

    try {
        const apiUrl = 'https://evtopback.liara.run/api/v1/chat/contacts/';

        const response = await axios.get(apiUrl, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.status !== 200) {
            throw new Error('Failed to fetch contacts');
        }

        return NextResponse.json(response.data);
    } catch (error) {
        console.error('Error fetching contacts:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
