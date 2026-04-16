import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Edit({ role, auth }) {
    const { data, setData, patch, errors, processing } = useForm({
        name: role.name,
        description: role.description,
    });

    function submit(e) {
        e.preventDefault();
        patch(route('admin.roles.update', role.id));
    }

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Editar Rol: ${role.name}`} />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-3xl font-bold text-gray-900">Editar Rol</h1>
                            <Link
                                href={route('admin.roles.index')}
                                className="text-gray-600 hover:text-gray-900"
                            >
                                ← Volver
                            </Link>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre del Rol
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg ${
                                        errors.name ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="ej: moderador"
                                />
                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Descripción
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg ${
                                        errors.description ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Descripción del rol"
                                    rows="4"
                                />
                                {errors.description && (
                                    <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                                )}
                            </div>

                            {/* Info */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-sm text-blue-800">
                                    <strong>Usuarios con este rol:</strong> {role.users_count}
                                </p>
                            </div>

                            {/* Submit Button */}
                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-2 px-6 rounded"
                                >
                                    {processing ? 'Actualizando...' : 'Actualizar Rol'}
                                </button>
                                <Link
                                    href={route('admin.roles.index')}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold py-2 px-6 rounded"
                                >
                                    Cancelar
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
