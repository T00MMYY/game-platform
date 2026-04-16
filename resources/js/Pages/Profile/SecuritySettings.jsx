import React, { useState, useRef, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function SecuritySettings({ auth }) {
    const [hasFaceReference, setHasFaceReference] = useState(!!auth.user?.face_reference_image);
    const [isCapturing, setIsCapturing] = useState(false);
    const [cameraError, setCameraError] = useState(null);
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);

    const startCamera = async () => {
        try {
            setCameraError(null);
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' }
            });
            streamRef.current = stream;
            videoRef.current.srcObject = stream;
            setIsCapturing(true);
        } catch (error) {
            setCameraError('No se puede acceder a la cámara. Verifica los permisos.');
            console.error('Camera error:', error);
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        setIsCapturing(false);
    };

    const capturePhoto = async () => {
        if (videoRef.current && canvasRef.current) {
            setLoading(true);
            const context = canvasRef.current.getContext('2d');
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
            context.drawImage(videoRef.current, 0, 0);
            
            canvasRef.current.toBlob(async (blob) => {
                const formData = new FormData();
                formData.append('image', blob, 'face.jpg');

                try {
                    const response = await fetch('/api/face/enroll', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${document.querySelector('meta[name="csrf-token"]')?.content}`,
                        },
                        body: formData
                    });

                    if (response.ok) {
                        setHasFaceReference(true);
                        stopCamera();
                        setMessage({ type: 'success', text: 'Foto facial registrada exitosamente' });
                        setTimeout(() => setMessage(null), 3000);
                    } else {
                        const data = await response.json();
                        setMessage({ type: 'error', text: 'Error: ' + (data.message || 'Error desconocido') });
                    }
                } catch (error) {
                    setMessage({ type: 'error', text: 'Error al registrar la foto' });
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            }, 'image/jpeg');
        }
    };

    const deleteFaceReference = async () => {
        if (confirm('¿Estás seguro de que quieres eliminar tu foto facial?')) {
            setLoading(true);
            try {
                const response = await fetch('/api/face', {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${document.querySelector('meta[name="csrf-token"]')?.content}`,
                    }
                });

                if (response.ok) {
                    setHasFaceReference(false);
                    setMessage({ type: 'success', text: 'Foto facial eliminada' });
                    setTimeout(() => setMessage(null), 3000);
                } else {
                    setMessage({ type: 'error', text: 'Error al eliminar la foto facial' });
                }
            } catch (error) {
                setMessage({ type: 'error', text: 'Error al eliminar la foto' });
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, []);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Configuración de Seguridad" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg p-6">
                        <h1 className="text-3xl font-bold text-gray-900 mb-6">Configuración de Seguridad</h1>

                        {/* Message */}
                        {message && (
                            <div className={`mb-6 p-4 rounded-lg ${
                                message.type === 'success' 
                                    ? 'bg-green-50 border border-green-200 text-green-800' 
                                    : 'bg-red-50 border border-red-200 text-red-800'
                            }`}>
                                {message.text}
                            </div>
                        )}

                        {/* Facial Recognition Section */}
                        <div className="border-t pt-6">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Autenticación Biométrica</h2>
                            <p className="text-gray-600 mb-6">
                                Registra tu rostro para una mayor seguridad al acceder a la plataforma.
                            </p>

                            {hasFaceReference ? (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <p className="text-green-800 mb-4">✓ Tienes una foto facial registrada</p>
                                    <button
                                        onClick={deleteFaceReference}
                                        disabled={loading}
                                        className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-2 px-4 rounded"
                                    >
                                        {loading ? 'Eliminando...' : 'Eliminar Foto Facial'}
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {!isCapturing ? (
                                        <button
                                            onClick={startCamera}
                                            disabled={loading}
                                            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-2 px-6 rounded"
                                        >
                                            Activar Cámara
                                        </button>
                                    ) : (
                                        <>
                                            <div className="relative w-full max-w-md mx-auto">
                                                <video
                                                    ref={videoRef}
                                                    autoPlay
                                                    playsInline
                                                    className="w-full rounded-lg border-2 border-gray-300"
                                                />
                                                <canvas
                                                    ref={canvasRef}
                                                    className="hidden"
                                                />
                                            </div>

                                            {cameraError && (
                                                <p className="text-red-600 text-sm">{cameraError}</p>
                                            )}

                                            <div className="flex gap-4 justify-center">
                                                <button
                                                    onClick={capturePhoto}
                                                    disabled={loading}
                                                    className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold py-2 px-6 rounded"
                                                >
                                                    {loading ? 'Capturando...' : 'Capturar Foto'}
                                                </button>
                                                <button
                                                    onClick={stopCamera}
                                                    disabled={loading}
                                                    className="bg-gray-400 hover:bg-gray-500 disabled:opacity-50 text-white font-bold py-2 px-6 rounded"
                                                >
                                                    Cancelar
                                                </button>
                                            </div>

                                            <p className="text-sm text-gray-600 text-center">
                                                Asegúrate de que tu rostro esté bien iluminado y visible en la pantalla.
                                            </p>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Info Box */}
                        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h3 className="font-semibold text-blue-900 mb-2">ℹ️ Información</h3>
                            <ul className="text-sm text-blue-800 space-y-1 ml-4 list-disc">
                                <li>Tu foto facial se almacena de forma segura en nuestros servidores</li>
                                <li>Solo se usa para verificar tu identidad cuando inicies sesiones</li>
                                <li>Puedes cambiar o eliminar tu foto en cualquier momento</li>
                                <li>También necesitarás tu contraseña para acceder</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
