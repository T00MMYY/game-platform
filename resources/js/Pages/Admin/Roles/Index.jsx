import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ roles, auth }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Gestión de Roles" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-3xl font-bold text-gray-900">Gestión de Roles</h1>
                            <Link
                                href={route('admin.roles.create')}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                + Nuevo Rol
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                                    <tr>
                                        <th className="px-6 py-3">Nombre</th>
                                        <th className="px-6 py-3">Descripción</th>
                                        <th className="px-6 py-3">Usuarios</th>
                                        <th className="px-6 py-3">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {roles.map((role) => (
                                        <tr key={role.id} className="border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                                            </td>
                                            <td className="px-6 py-4">{role.description}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                                                    {role.users_count}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 flex gap-2">
                                                <Link
                                                    href={route('admin.roles.edit', role.id)}
                                                    className="text-blue-600 hover:text-blue-900 font-medium"
                                                >
                                                    Editar
                                                </Link>
                                                {role.users_count === 0 && (
                                                    <Link
                                                        href={route('admin.roles.destroy', role.id)}
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
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
