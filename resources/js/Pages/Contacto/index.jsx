import { Head, Link, useForm } from "@inertiajs/react";

export default function Index({ games }) {
    const { delete: destroy } = useForm();

    const handleDelete = (id) => {
        if (confirm("¿Estás seguro de que quieres eliminar este juego?")) {
            destroy(route("games.destroy", id));
        }
    };

    return (
        <div className="py-12">
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                    <div className="p-6 text-gray-900 border-b border-gray-200">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-500">
                                <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                                    <tr>
                                        <th className="px-6 py-3">Título</th>
                                        <th className="px-6 py-3">Publicado</th>
                                        <th className="px-6 py-3">Creador</th>
                                        <th className="px-6 py-3 text-right">
                                            Acciones
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {games.map((game) => (
                                        <tr
                                            key={game.id}
                                            className="border-b bg-white hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                {game.title}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-semibold ${game.is_published ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                                                >
                                                    {game.is_published
                                                        ? "Sí"
                                                        : "No"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {game.user?.name}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link
                                                    href={route(
                                                        "games.edit",
                                                        game.id,
                                                    )}
                                                    className="font-medium text-blue-600 hover:underline mr-4"
                                                >
                                                    Editar
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(game.id)
                                                    }
                                                    className="font-medium text-red-600 hover:underline"
                                                >
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {games.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan="5"
                                                className="px-6 py-4 text-center"
                                            >
                                                No hay juegos registrados.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
