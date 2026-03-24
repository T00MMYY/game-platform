import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm, router } from '@inertiajs/react';

export default function Edit({ game }) {
    // Para envío de archivos en actualización con Inertia, a veces se usa post con _method: 'put'
    const { data, setData, post, processing, errors } = useForm({
        _method: 'put',
        title: game.title || '',
        description: game.description || '',
        url: game.url || '',
        is_published: game.is_published ? true : false,
        thumbnail: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('games.update', game.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Editar Juego: {game.title}
                </h2>
            }
        >
            <Head title={`Editar ${game.title}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 border-b border-gray-200">
                            
                            <form onSubmit={submit} className="max-w-xl">
                                <div>
                                    <InputLabel htmlFor="title" value="Título" />
                                    <TextInput
                                        id="title"
                                        type="text"
                                        name="title"
                                        value={data.title}
                                        className="mt-1 block w-full"
                                        autoComplete="title"
                                        onChange={(e) => setData('title', e.target.value)}
                                    />
                                    <InputError message={errors.title} className="mt-2" />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="description" value="Descripción (Opcional)" />
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={data.description}
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows="3"
                                    />
                                    <InputError message={errors.description} className="mt-2" />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="url" value="Ruta / URL (*)" />
                                    <TextInput
                                        id="url"
                                        type="text"
                                        name="url"
                                        value={data.url}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('url', e.target.value)}
                                    />
                                    <InputError message={errors.url} className="mt-2" />
                                </div>

                                <div className="mt-4 block">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name="is_published"
                                            checked={data.is_published}
                                            onChange={(e) => setData('is_published', e.target.checked)}
                                            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                                        />
                                        <span className="ms-2 text-sm text-gray-600">Publicado</span>
                                    </label>
                                    <InputError message={errors.is_published} className="mt-2" />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="thumbnail" value="Actualizar Imagen (Opcional)" />
                                    {game.thumbnail && (
                                        <div className="mb-2 text-sm text-gray-500">
                                            Imagen actual guardada. Sube una nueva para reemplazarla.
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        id="thumbnail"
                                        name="thumbnail"
                                        onChange={(e) => setData('thumbnail', e.target.files[0])}
                                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                    />
                                    <InputError message={errors.thumbnail} className="mt-2" />
                                </div>

                                <div className="mt-6 flex items-center justify-end">
                                    <Link
                                        href={route('games.index')}
                                        className="rounded-md px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                                    >
                                        Cancelar
                                    </Link>
                                    <PrimaryButton className="ms-4" disabled={processing}>
                                        Actualizar Juego
                                    </PrimaryButton>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
