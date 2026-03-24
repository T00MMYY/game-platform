import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        url: '',
        is_published: false,
        thumbnail: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('games.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center p-2">
                    <Link href={route('games.index')} className="mr-4 text-gray-400 hover:text-gray-600 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    </Link>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
                            Añadir Nuevo Juego
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title="Crear Juego" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="p-8 sm:p-10">
                            
                            <form onSubmit={submit} className="space-y-6">
                                {/* Sección Principal */}
                                <div className="bg-gray-50/50 p-6 rounded-xl border border-gray-100">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Información Básica</h3>
                                    
                                    <div className="space-y-5">
                                        <div>
                                            <InputLabel htmlFor="title" value="Título del Juego" className="text-gray-700 font-semibold" />
                                            <TextInput
                                                id="title"
                                                type="text"
                                                name="title"
                                                value={data.title}
                                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-shadow"
                                                autoComplete="title"
                                                isFocused={true}
                                                placeholder="Ej. Súper Mario Runner"
                                                onChange={(e) => setData('title', e.target.value)}
                                            />
                                            <InputError message={errors.title} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="description" value="Descripción (Opcional)" className="text-gray-700 font-semibold" />
                                            <textarea
                                                id="description"
                                                name="description"
                                                value={data.description}
                                                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-shadow"
                                                placeholder="Una breve descripción para atraer a los jugadores..."
                                                onChange={(e) => setData('description', e.target.value)}
                                                rows="3"
                                            />
                                            <InputError message={errors.description} className="mt-2" />
                                        </div>
                                    </div>
                                </div>

                                {/* Sección Técnica */}
                                <div className="bg-gray-50/50 p-6 rounded-xl border border-gray-100">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Detalles Técnicos y Visuales</h3>
                                    
                                    <div className="space-y-5">
                                        <div>
                                            <InputLabel htmlFor="url" value="URL del Juego / Ruta Local (*)" className="text-gray-700 font-semibold" />
                                            <div className="mt-1 flex rounded-lg shadow-sm">
                                                <span className="inline-flex items-center rounded-l-lg border border-r-0 border-gray-300 bg-gray-100 px-3 text-gray-500 sm:text-sm">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                                                </span>
                                                <TextInput
                                                    id="url"
                                                    type="text"
                                                    name="url"
                                                    value={data.url}
                                                    className="block w-full min-w-0 flex-1 rounded-none rounded-r-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 transition-shadow"
                                                    placeholder="http://localhost:8000/dist/index.html o enlace externo"
                                                    onChange={(e) => setData('url', e.target.value)}
                                                />
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1.5 ml-1">Requerido. Dirección donde reside el código HTML del videojuego.</p>
                                            <InputError message={errors.url} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="thumbnail" value="Portada del Juego (Opcional)" className="text-gray-700 font-semibold" />
                                            <div className="mt-1 flex justify-center rounded-lg border border-dashed border-gray-300 px-6 py-6 hover:border-indigo-400 transition-colors bg-white">
                                                <div className="text-center">
                                                    <svg className="mx-auto h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                                        <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                                                    </svg>
                                                    <div className="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
                                                        <label htmlFor="thumbnail" className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                                                            <span>Subir un archivo</span>
                                                            <input id="thumbnail" name="thumbnail" type="file" className="sr-only" onChange={(e) => setData('thumbnail', e.target.files[0])} accept="image/*" />
                                                        </label>
                                                    </div>
                                                    <p className="text-xs leading-5 text-gray-500">PNG, JPG, GIF hasta 10MB</p>
                                                    {data.thumbnail && <p className="text-xs font-semibold text-green-600 mt-2">✨ Archivo cargado: {data.thumbnail.name}</p>}
                                                </div>
                                            </div>
                                            <InputError message={errors.thumbnail} className="mt-2" />
                                        </div>

                                        <div className="mt-4 bg-white border border-gray-200 rounded-lg p-4 shadow-sm relative overflow-hidden">
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-purple-500"></div>
                                            <label className="flex items-center cursor-pointer">
                                                <div className="relative">
                                                    <input
                                                        type="checkbox"
                                                        name="is_published"
                                                        checked={data.is_published}
                                                        onChange={(e) => setData('is_published', e.target.checked)}
                                                        className="sr-only"
                                                    />
                                                    <div className={`block w-14 h-8 rounded-full transition-colors ${data.is_published ? 'bg-indigo-500' : 'bg-gray-300'}`}></div>
                                                    <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${data.is_published ? 'transform translate-x-6' : ''}`}></div>
                                                </div>
                                                <div className="ml-4">
                                                    <span className="block text-sm font-semibold text-gray-900">Estado de Publicación</span>
                                                    <span className="block text-xs text-gray-500 mt-0.5">Actívalo para que el juego aparezca inmediatamente en el Catálogo de jugadores.</span>
                                                </div>
                                            </label>
                                            <InputError message={errors.is_published} className="mt-2" />
                                        </div>
                                    </div>
                                </div>

                                {/* Botones */}
                                <div className="mt-8 pt-5 border-t border-gray-100 flex items-center justify-end space-x-4">
                                    <Link
                                        href={route('games.index')}
                                        className="rounded-lg px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
                                    >
                                        Cancelar
                                    </Link>
                                    <button 
                                        type="submit" 
                                        disabled={processing}
                                        className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:from-blue-500 hover:to-indigo-500 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                                    >
                                        {processing ? (
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        ) : (
                                            <svg className="w-5 h-5 mr-2 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                        )}
                                        Guardar Juego en Catálogo
                                    </button>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
