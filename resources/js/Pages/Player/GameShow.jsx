import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function GameShow({ auth, game }) {
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

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-black overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="relative w-full" style={{ paddingBottom: '56.25%', height: 0 }}>
                            <iframe 
                                src={game.url} 
                                title={game.title}
                                className="absolute top-0 left-0 w-full h-full border-0 focus:outline-none"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                    {game.description && (
                        <div className="mt-4 bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                <h3 className="font-bold mb-2">Descripción:</h3>
                                <p>{game.description}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
