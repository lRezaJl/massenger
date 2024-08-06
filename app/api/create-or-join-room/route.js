import { NextResponse } from 'next/server';
import axios from 'axios';


export async function POST(request) {
    try {
        // دریافت داده‌ها از درخواست
        const body = await request.json();
        const { username } = body;

        if (!username) {
            return NextResponse.json({ error: 'Username is required' }, { status: 400 });
        }

        // دریافت توکن از هدر
        const token = request.headers.get('Authorization')?.split(' ')[1];
        
        if (!token) {
            return NextResponse.json({ error: 'Token is required' }, { status: 401 });
        }

        
        // درخواست به API دیگر
        const response = await axios(`http://localhost:8000/api/v1/chat/create-or-join-room/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            data: { username },
        });

        const data = await response.data;
        return NextResponse.json(data);

    } catch (error) {
        
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
