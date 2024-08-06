"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
    const [username, setUsername] = useState('');
    const [fullname, setFullname] = useState('');
    const [role, setRole] = useState(2); // or whatever default role is appropriate
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    fullname,
                    role,
                    password,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to register');
            }

            const data = await response.json();
            if (data.access && data.refresh) {
                localStorage.setItem('username', data.username);
                localStorage.setItem('access', data.access);
                localStorage.setItem('refresh', data.refresh);
                router.push('/');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
            />
            <input
                type="text"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                placeholder="Fullname"
            />
            <input
                type="number"
                value={role}
                onChange={(e) => setRole(parseInt(e.target.value))}
                placeholder="Role"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <button type="submit">Register</button>
        </form>
    );
}
