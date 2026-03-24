import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Edit({ game }) {
    // Formulario simplificado: solo título, descripción y portada
    const { data, setData, post, processing, errors } = useForm({
        _method: 'put',
        title: game.title || '',
        description: game.description || '',
        thumbnail: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('games.update', game.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center">
                    <Link href={route('games.index')} className="mr-4 text-gray-400 hover:text-indigo-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    </Link>
                    <h2 className="text-xl font-semibold text-gray-800 leading-tight">
                        Editar Juego: {game.title}
                    </h2>
                </div>
            }
        >
            <Head title={`Editar ${game.title}`} />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border p-8">
                        
                        <form onSubmit={submit} className="space-y-6">
                            
                            {/* Título */}
                            <div>
                                <InputLabel htmlFor="title" value="Título del Juego" />
                                <TextInput
                                    id="title"
                                    type="text"
                                    value={data.title}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('title', e.target.value)}
                                />
                                <InputError message={errors.title} className="mt-2" />
                            </div>

                            {/* Descripción */}
                            <div>
                                <InputLabel htmlFor="description" value="Descripción" />
                                <textarea
                                    id="description"
                                    value={data.description}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows="4"
                                />
                                <InputError message={errors.description} className="mt-2" />
                            </div>

                            {/* Portada / Thumbnail */}
                            <div className="bg-gray-50 p-4 rounded-lg border">
                                <InputLabel htmlFor="thumbnail" value="Imagen de Portada" />
                                
                                <div className="mt-2 flex items-center space-x-4">
                                    {game.thumbnail && (
                                        <img 
                                            src={game.thumbnail.startsWith('http') ? game.thumbnail : '/storage/' + game.thumbnail} 
                                            className="h-20 w-32 object-cover rounded border" 
                                            alt="Actual" 
                                        />
                                    )}
                                    <input 
                                        type="file" 
                                        className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                        onChange={(e) => setData('thumbnail', e.target.files[0])} 
                                        accept="image/*" 
                                    />
                                </div>
                                <InputError message={errors.thumbnail} className="mt-2" />
                            </div>

                            {/* Botones */}
                            <div className="flex items-center justify-end space-x-3 border-t pt-6">
                                <Link
                                    href={route('games.index')}
                                    className="text-sm text-gray-600 hover:underline"
                                >
                                    Cancelar
                                </Link>
                                <button 
                                    type="submit" 
                                    disabled={processing}
                                    className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:border-indigo-900 focus:ring ring-indigo-300 disabled:opacity-25 transition ease-in-out duration-150"
                                >
                                    {processing ? 'Guardando...' : 'Guardar Cambios'}
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}