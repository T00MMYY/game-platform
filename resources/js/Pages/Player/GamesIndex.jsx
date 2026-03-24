import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function GamesIndex({ auth, games }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Catálogo de Juegos</h2>}
        >
            <Head title="Catálogo de Juegos" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Contador simple */}
                    <p className="mb-4 text-gray-600">{games.length} juegos disponibles</p>

                    {/* Grid de juegos */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {games.length === 0 ? (
                            <div className="col-span-3 p-6 bg-white border rounded shadow text-center">
                                No hay juegos publicados todavía.
                            </div>
                        ) : (
                            games.map((game) => (
                                <div key={game.id} className="bg-white overflow-hidden shadow-sm sm:rounded-lg border flex flex-col">
                                    
                                    {/* Imagen o Placeholder */}
                                    <div className="h-40 bg-gray-200 flex items-center justify-center">
                                        {game.thumbnail ? (
                                            <img 
                                                src={game.thumbnail.startsWith('http') ? game.thumbnail : `/storage/${game.thumbnail}`} 
                                                className="w-full h-full object-cover" 
                                                alt={game.title} 
                                            />
                                        ) : (
                                            <span className="text-gray-400">Sin imagen</span>
                                        )}
                                    </div>

                                    {/* Contenido del Juego */}
                                    <div className="p-6">
                                        <h3 className="text-lg font-bold">{game.title}</h3>
                                        <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                                            {game.description || "Sin descripción disponible."}
                                        </p>
                                        <p className="text-xs text-indigo-500 mt-2">Por: {game.user?.name || 'Sistema'}</p>
                                    </div>

                                    {/* Acción principal */}
                                    <div className="p-4 bg-gray-50 border-t mt-auto">
                                        <Link
                                            href={route("play.show", game.id)}
                                            className="block w-full text-center py-2 bg-indigo-600 text-white rounded font-semibold hover:bg-indigo-700"
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