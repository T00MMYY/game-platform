import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

export default function FaceVerificationCamera({ gameId, onVerified, onCancel }) {
    const webcamRef = useRef(null);
    const [status, setStatus] = useState('idle'); // idle, verifying, verified, error
    const [errorMessage, setErrorMessage] = useState('');

    const videoConstraints = {
        width: 720,
        height: 720,
        facingMode: "user"
    };

    const captureAndVerify = useCallback(async () => {
        setStatus('verifying');
        setErrorMessage('');
        
        try {
            // Toma screenshot desde el video stream (en formato base64 JPEG)
            const imageSrc = webcamRef.current.getScreenshot();
            
            if (!imageSrc) {
                setStatus('error');
                setErrorMessage('No se pudo capturar la imagen. Verifica los permisos de tu cámara.');
                return;
            }

            // Manda los datos al backend de Laravel
            const response = await axios.post('/api/session/start', {
                game_id: gameId,
                current_image: imageSrc
            });

            if (response.status === 201) {
                setStatus('verified');
                onVerified(response.data.session_id);
            }
        } catch (error) {
            setStatus('error');
            setErrorMessage(error.response?.data?.message || 'Error de conexión o de reconocimiento facial.');
        }
    }, [webcamRef, gameId, onVerified]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-95 backdrop-blur-md">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-2 tracking-tight">Verificación Biométrica</h2>
                <p className="text-gray-500 mb-8 text-sm leading-relaxed">
                    Antes de jugar necesitamos comprobar que eres tú. Mantén tu rostro centrado.
                </p>

                <div className="flex justify-center mb-8">
                    <div className="relative bg-gray-100 rounded-full overflow-hidden border-[6px] border-indigo-50 shadow-inner w-56 h-56 transition-all">
                        {status !== 'verified' ? (
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                videoConstraints={videoConstraints}
                                className="w-full h-full object-cover scale-110"
                                mirrored={true}
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-green-50">
                                <svg className="w-20 h-20 text-green-500 drop-shadow-sm mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                <span className="text-green-700 font-bold text-lg">Identidad Lista</span>
                            </div>
                        )}

                        {/* Línea escáner animada */}
                        {status === 'verifying' && (
                            <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 opacity-60 animate-scan"></div>
                        )}
                    </div>
                </div>

                {status === 'error' && (
                    <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100 bg-opacity-80">
                        {errorMessage}
                    </div>
                )}

                <div className="flex flex-col space-y-3">
                    <button
                        onClick={captureAndVerify}
                        disabled={status === 'verifying' || status === 'verified'}
                        className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all transform active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                    >
                        {status === 'verifying' ? 'Analizando por IA...' : status === 'verified' ? '¡Iniciando Juego!' : 'Tomar Foto y Jugar'}
                    </button>
                    
                    <button
                        onClick={onCancel}
                        disabled={status === 'verifying' || status === 'verified'}
                        className="w-full py-2.5 text-gray-500 hover:text-gray-800 text-sm font-medium transition-colors"
                    >
                        Cancelar y regresar
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes scan {
                    0% { top: 0%; }
                    50% { top: 100%; }
                    100% { top: 0%; }
                }
                .animate-scan {
                    animation: scan 2s linear infinite;
                    box-shadow: 0 0 10px 2px rgba(99, 102, 241, 0.6);
                }
            `}</style>
        </div>
    );
}
