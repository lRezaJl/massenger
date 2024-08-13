import React, { useEffect, useState } from "react";
import axios from "axios";
import { IoChatboxEllipses } from "react-icons/io5";
import { HiUsers } from "react-icons/hi2";
import { IoIosArrowBack } from "react-icons/io";

const ContactList = ({ onSelectContact , onConsultants, clear }) => {
    const [contacts, setContacts] = useState([]);
    const [consultants, setConsultants] = useState([]);
    const [selectedContact, setselectedContact] = useState();
    const [searchUsername, setSearchUsername] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [tabSelected, SetTabSelected] = useState("tab1")
    const [selectConsultants, SetSelectConsultants] = useState(null)

    const TabHandler = (id) => {
        SetTabSelected(id)
    }

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
        const webSocket = new WebSocket(`wss://evtopback.liara.run/ws/contacts/?token=${token}`);

        webSocket.onmessage = (e) => {
            const data = JSON.parse(e.data);

            if (data.type === 'update_contacts') {
                setContacts(data.contacts);
            }
            if (data.type === 'update_rooms') {
                setConsultants(data.rooms);
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
                body: JSON.stringify({ username: searchUsername, type: "without" }),
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
        <div className="w-full md:w-64 h-full p-4 bg-secondaryTextColor">
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
                    className="w-full p-2 bg-primaryPurple rounded text-secondaryTextColor"
                >
                    جستجو
                </button>
            </form>
            <div role="tablist" className="tabs tabs-boxed">
                <button onClick={() => {TabHandler('tab1'); SetSelectConsultants(null); clear()}} id="tab1" role="tab" className={`tab duration-150 ${tabSelected === 'tab1' && "bg-purple-500 text-secondaryTextColor"}`}>
                    <IoChatboxEllipses size={20} color="white" />
                    <p className="ml-1 font-black">چت</p>
                </button>
                <button onClick={() => TabHandler('tab2')} id="tab2" role="tab" className={`tab duration-150 ${tabSelected === 'tab2' && "bg-purple-500 text-secondaryTextColor"}`}>
                    <HiUsers size={20} color="white" />
                    <p className="ml-1 font-black">مشاور</p>
                </button>
            </div>
            {selectConsultants && <div role="tablist" className="tabs tabs-boxed mt-2">
                <button onClick={()=> SetSelectConsultants(null)} role="tab" className={`tab duration-150  text-bg-purple-500`}>
                    <IoIosArrowBack size={20} color="white" />
                    <p className="ml-1 font-black">بازگشت</p>
                </button>
            </div>}
            <ul className="mt-5 flex flex-col overflow-y-auto no-scrollbar flex-1">
                {isLoading ? (
                    <li className="p-2 rounded-2xl mb-2 bg-gray-200">Loading...</li>
                ) : (
                    tabSelected === "tab1" && (contacts.map((contact) => (
                        <li
                            key={contact.pk}
                            className={`p-2 rounded-2xl mb-2 cursor-pointer hover:bg-primaryPurple ${selectedContact === contact && "bg-primaryPurple"} `}
                            onClick={() => { onSelectContact(contact); setselectedContact(contact); }}
                        >
                            <div className="flex items-center">
                                <div className={`avatar placeholder ${contact.online ? 'online' : 'offline'}`}>
                                    <div className="btn rounded-badge glass bg-purple-500 text-secondaryTextColor">
                                        <span>{contact.username[0]}</span>
                                    </div>
                                </div>
                                <span className={`ml-2 ${selectedContact === contact ? "text-secondaryTextColor" : "text-textColor"} `}>{contact.username}</span>
                                {contact.unread_count > 0 && (
                                    <span className="rounded-full ml-5 bg-primaryPurple py-1 px-2 text-secondaryTextColor">+{contact.unread_count}</span>
                                )}
                            </div>
                        </li>
                    ))) || tabSelected === "tab2" && selectConsultants === null && (consultants.consultants.map((contact) => (
                        <li
                            key={contact.id}
                            className={`p-2 rounded-2xl mb-2 cursor-pointer hover:bg-primaryPurple`}
                            onClick={() => { SetSelectConsultants(contact.username) }}
                        >
                            <div className="flex items-center">
                                <div className={`avatar placeholder ${contact.online ? 'online' : 'offline'}`}>
                                    <div className="btn rounded-badge glass bg-purple-500 text-secondaryTextColor">
                                        <span>{contact.username[0]}</span>
                                    </div>
                                </div>
                                <span className={`ml-2 text-ultraGray`}>{contact.username}</span>
                            </div>
                        </li>
                    ))) || tabSelected === "tab2" && selectConsultants !== null && (consultants.rooms.filter((contact) => contact.name.includes(selectConsultants))).map((room) => (room.participants.filter((e) => e.username !== selectConsultants)).map((room) => (
                        <li
                            key={room.id}
                            className={`p-2 rounded-2xl mb-2 cursor-pointer hover:bg-primaryPurple`}
                            onClick={() => { onConsultants(selectConsultants); onSelectContact(room) }}
                        >
                            <div className="flex items-center">
                                <div className={`avatar placeholder`}>
                                    <div className="btn rounded-badge glass bg-purple-500 text-secondaryTextColor">
                                        <span>{room.username[0]}</span>
                                    </div>
                                </div>
                                <span className={`ml-2 text-ultraGray`}>{room.username}</span>
                            </div>
                        </li>
                    )))
                )}
            </ul>
        </div>
    );
};

export default ContactList;
