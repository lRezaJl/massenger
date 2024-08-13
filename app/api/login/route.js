import axios from 'axios';

export async function POST(req) {
    const { username, password } = await req.json();

    try {
        const response = await axios.post('https://evtopback.liara.run/api/v1/users/login/', {
            username,
            password,
        });

        return new Response(JSON.stringify(response.data), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({
            message: error.response?.data || 'Internal server error',
        }), {
            status: error.response?.status || 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
