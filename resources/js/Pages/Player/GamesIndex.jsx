import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function GamesIndex({ auth, games }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Catálogo de Juegos</h2>}
        >
            <Head title="Jugar" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {games.length === 0 ? (
                            <div className="col-span-full p-6 bg-white overflow-hidden shadow-sm sm:rounded-lg text-center text-gray-500">
                                No hay juegos publicados disponibles por el momento.
                            </div>
                        ) : (
                            games.map((game) => (
                                <div key={game.id} className="bg-white overflow-hidden shadow-sm sm:rounded-lg flex flex-col">
                                    {game.thumbnail && (
                                        <img src={game.thumbnail.startsWith('http') ? game.thumbnail : '/storage/' + game.thumbnail} alt={game.title} className="w-full h-48 object-cover" />
                                    )}
                                    <div className="p-6 flex-grow">
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">{game.title}</h3>
                                        <p className="text-gray-600 text-sm mb-4 flex-grow">{game.description}</p>
                                        <p className="text-xs text-gray-400 mb-4">Creado por {game.user?.name || 'Desconocido'}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 border-t border-gray-100 mt-auto">
                                        <Link 
                                            href={route('play.show', game.id)}
                                            className="w-full inline-flex justify-center items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                        >
                                            Jugar Ahora
                                        </Link>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
