import { NextResponse } from 'next/server';
import axios from 'axios';


export async function POST(request) {
    try {

        const body = await request.json();

        const type = body.type;
        const username = body.username;

        console.log(body);


        if (!username) {
            return NextResponse.json({ error: 'Username is required' }, { status: 400 });
        }

        const token = request.headers.get('Authorization')?.split(' ')[1];

        if (!token) {
            return NextResponse.json({ error: 'Token is required' }, { status: 401 });
        }

        if (type === "with") {

            const consultant = body.consultant;

            const response = await axios(`https://evtopback.liara.run/api/v1/chat/create-or-join-room/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                data: { username, consultant },
            });

            const data = await response.data;
            return NextResponse.json(data);

        } else if (type === "without") {

            const response = await axios(`https://evtopback.liara.run/api/v1/chat/create-or-join-room/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                data: { username },
            });

            const data = await response.data;
            return NextResponse.json(data);
        }

    } catch (error) {
        console.log(error);

        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
