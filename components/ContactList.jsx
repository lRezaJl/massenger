import React, { useEffect, useState } from "react";
import axios from "axios";

const ContactList = ({ onSelectContact }) => {
    const [contacts, setContacts] = useState([]);
    const [searchUsername, setSearchUsername] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get('/api/get-contacts', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access')}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.status !== 200) {
                    throw new Error('Failed to fetch contacts');
                }

                setContacts(response.data || []);
            } catch (error) {
                console.error('Error fetching contacts:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchContacts();
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('access');
        const webSocket = new WebSocket(`ws://localhost:8000/ws/contacts/?token=${token}`);

        webSocket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            if (data.type === 'update_contacts') {
                console.log("Received updated contacts:", data.contacts);
                setContacts(data.contacts);
            }
        };

        webSocket.onopen = () => {
            console.log('WebSocket connected');
        };

        webSocket.onclose = () => {
            console.log('WebSocket disconnected');
        };

        return () => {
            webSocket.close();
        };
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('/api/create-or-join-room', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: searchUsername }),
            });

            if (!response.ok) {
                throw new Error('Failed to create or join room');
            }

            const updatedResponse = await axios.get('/api/get-contacts', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access')}`,
                    'Content-Type': 'application/json',
                },
            });

            if (updatedResponse.status === 200) {
                setContacts(updatedResponse.data || []);
            }

        } catch (error) {
            console.error('Error creating or joining room:', error);
        }
    };

    return (
        <div className="w-64 h-full p-4 bg-purple-100">
            <h2 className="text-lg font-bold mb-4 text-textColor">Contacts</h2>
            <form onSubmit={handleSearch} className="mb-4">
                <input
                    type="text"
                    placeholder="جستجو کاربر..."
                    value={searchUsername}
                    onChange={(e) => setSearchUsername(e.target.value)}
                    className="w-full p-2 mb-2 rounded border"
                />
                <button
                    type="submit"
                    className="w-full p-2 bg-primaryPurple text-white rounded"
                >
                    جستجو
                </button>
            </form>
            <ul className="mt-10">
                {isLoading ? (
                    <li className="p-2 rounded-2xl mb-2 bg-gray-200">Loading...</li>
                ) : (
                    contacts.map((contact) => (
                        <li
                            key={contact.pk}
                            className="p-2 rounded-2xl mb-2 cursor-pointer bg-white hover:bg-primaryPurple hover:text-secondaryTextColor"
                            onClick={() => onSelectContact(contact)}
                        >
                            <div className="flex items-center">
                                <div className={`avatar placeholder ${contact.online ? 'online' : 'offline'}`}>
                                    <div className="btn rounded-badge glass bg-purple-500 text-secondaryTextColor">
                                        <span>{contact.username[0]}</span>
                                    </div>
                                </div>
                                <span className="ml-2 text-textColor">{contact.username}</span>
                                {contact.unread_count > 0 && (
                                    <span className="rounded-full ml-5 bg-primaryPurple py-1 px-2 text-secondaryTextColor">+{contact.unread_count}</span>
                                )}
                            </div>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default ContactList;
