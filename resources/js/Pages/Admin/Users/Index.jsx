import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ users, auth }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Gestión de Usuarios" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
                            <Link
                                href={route('admin.users.create')}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                + Nuevo Usuario
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                                    <tr>
                                        <th className="px-6 py-3">Nombre</th>
                                        <th className="px-6 py-3">Email</th>
                                        <th className="px-6 py-3">Rol</th>
                                        <th className="px-6 py-3">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.data.map((user) => (
                                        <tr key={user.id} className="border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                                            <td className="px-6 py-4">{user.email}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                                    {user.role.name}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 flex gap-2">
                                                <Link
                                                    href={route('admin.users.edit', user.id)}
                                                    className="text-blue-600 hover:text-blue-900 font-medium"
                                                >
                                                    Editar
                                                </Link>
                                                <Link
                                                    href={route('admin.users.destroy', user.id)}
                                                    method="delete"
                                                    as="button"
                                                    className="text-red-600 hover:text-red-900 font-medium"
                                                    onClick={(e) => {
                                                        if (!confirm('¿Estás seguro?')) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                >
                                                    Eliminar
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="mt-6 flex justify-between items-center">
                            {users.prev_page_url && (
                                <Link
                                    href={users.prev_page_url}
                                    className="text-blue-600 hover:text-blue-900"
                                >
                                    ← Anterior
                                </Link>
                            )}
                            <span className="text-gray-600">
                                Página {users.current_page} de {users.last_page}
                            </span>
                            {users.next_page_url && (
                                <Link
                                    href={users.next_page_url}
                                    className="text-blue-600 hover:text-blue-900"
                                >
                                    Siguiente →
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
