import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import FaceVerificationCamera from './Partials/FaceVerificationCamera';

export default function GameShow({ auth, game }) {
    const [isVerified, setIsVerified] = useState(false);
    const [sessionId, setSessionId] = useState(null);

    const handleVerified = (newSessionId) => {
        setSessionId(newSessionId);
        // Esperamos 1.5s para que vea el check verde y cerramos la cámara
        setTimeout(() => {
            setIsVerified(true);
        }, 1500); 
    };

    const handleCancel = () => {
        router.visit(route('play.index'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Jugando: {game.title}
                    </h2>
                    <Link
                        href={route('play.index')}
                        className="text-sm text-indigo-600 hover:text-indigo-900"
                    >
                        &larr; Volver al catálogo
                    </Link>
                </div>
            }
        >
            <Head title={game.title} />

            {/* Modal superpuesto de Verificación de Rostro */}
            {!isVerified && (
                <FaceVerificationCamera 
                    gameId={game.id} 
                    onVerified={handleVerified}
                    onCancel={handleCancel}
                />
            )}

            {/* Contenedor del Iframe transicionado */}
            <div className={`py-6 transition-all duration-1000 ${!isVerified ? 'opacity-0 scale-95 pointer-events-none blur-sm' : 'opacity-100 scale-100 blur-0'}`}>
                <div className="mx-auto max-w-6xl sm:px-6 lg:px-8">
                    <div className="bg-[#0b0c10] overflow-hidden shadow-2xl sm:rounded-2xl border border-gray-800 flex items-center justify-center" style={{ height: 'calc(100vh - 220px)', minHeight: '400px' }}>
                        {isVerified && (
                            <iframe 
                                src={`${game.url}?session_id=${sessionId}`} 
                                title={game.title}
                                className="w-full h-full border-0 focus:outline-none"
                                allowFullScreen
                            ></iframe>
                        )}
                    </div>
                    {game.description && (
                        <div className="mt-6 bg-white overflow-hidden shadow-sm sm:rounded-xl border border-gray-100 max-w-6xl mx-auto">
                            <div className="p-5 text-gray-900">
                                <h3 className="font-bold mb-1 text-md text-indigo-900">Descripción principal:</h3>
                                <p className="text-gray-600 leading-relaxed text-sm">{game.description}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
