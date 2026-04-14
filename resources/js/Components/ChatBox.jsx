import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function ChatBox({ gameId, currentUser }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    // Fetch mensajes iniciales
    useEffect(() => {
        axios.get(`/games/${gameId}/chat`).then((response) => {
            setMessages(response.data);
        });
    }, [gameId]);

    // WebSocket listener
    useEffect(() => {
        if (!window.Echo) return;

        const channel = window.Echo.private(`game.${gameId}`);

        channel.listen('MessageSent', (e) => {
            setMessages((prev) => [...prev, e.message]);
        });

        return () => {
            channel.stopListening('MessageSent');
            window.Echo.leave(`game.${gameId}`);
        };
    }, [gameId]);

    // Scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;

        // Optimistic update
        const tempId = Date.now();
        const msgToSend = {
            id: tempId,
            user_id: currentUser.id,
            user: { id: currentUser.id, name: currentUser.name },
            message: newMessage,
            created_at: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, msgToSend]);
        setNewMessage('');

        axios.post(`/games/${gameId}/chat`, { message: msgToSend.message }).catch((error) => {
            console.error("Error sending message:", error);
            // Optionally, remove optimistic message on failure
        });
    };

    return (
        <div className="mt-6 bg-[#1a1c23] overflow-hidden shadow-sm sm:rounded-xl border border-gray-800 max-w-6xl mx-auto flex flex-col h-80">
            <div className="p-4 bg-[#0b0c10] border-b border-gray-800">
                <h3 className="font-bold text-md text-gray-200">Chat del Juego</h3>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto bg-[#13151a]">
                {messages.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center mt-4">Aún no hay mensajes. ¡Sé el primero!</p>
                ) : (
                    <div className="flex flex-col space-y-2">
                        {messages.map((msg) => {
                            const isMe = msg.user_id === currentUser.id;
                            return (
                                <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                    <span className="text-xs text-gray-500 mb-1 px-1">
                                        {isMe ? 'Tú' : msg.user?.name || 'Usuario'}
                                    </span>
                                    <div className={`px-4 py-2 rounded-2xl max-w-[80%] text-sm ${isMe ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-gray-800 text-gray-200 rounded-bl-none'}`}>
                                        {msg.message}
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            <div className="p-3 bg-[#0b0c10] border-t border-gray-800">
                <form onSubmit={sendMessage} className="flex space-x-2">
                    <input
                        type="text"
                        className="flex-1 bg-gray-900 border-gray-700 text-gray-200 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                        placeholder="Escribe un mensaje..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        autoComplete="off"
                    />
                    <button
                        type="submit"
                        disabled={newMessage.trim() === ''}
                        className="text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    >
                        Enviar
                    </button>
                </form>
            </div>
        </div>
    );
}
