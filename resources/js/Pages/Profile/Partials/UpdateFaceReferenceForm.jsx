import { useRef, useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import { useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';

export default function UpdateFaceReferenceForm({ className = '' }) {
    const user = usePage().props.auth.user;

    const { data, setData, post, errors, processing, recentlySuccessful } = useForm({
        face_reference_image: null,
    });

    const [previewUrl, setPreviewUrl] = useState(
        user.face_reference_image ? `/storage/${user.face_reference_image}` : null
    );

    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('face_reference_image', file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        // Since we are uploading a file, we need to use POST method.
        post(route('profile.photo.update'), {
            preserveScroll: true,
            onSuccess: () => {
                // Clear the file input
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            },
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 leading-tight">Foto de Referencia Facial</h2>

                <p className="mt-1 text-sm text-gray-600">
                    Sube una foto de tu rostro. Esta imagen se usará como referencia para permitir o denegar el acceso a los juegos mediante biometría. Por favor, asegúrate de que tu rostro se vea claramente y con buena iluminación.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="face_reference_image" value="Imagen de Referencia" />
                    
                    {previewUrl && (
                        <div className="mt-2 mb-4">
                            <img
                                src={previewUrl}
                                alt="Previsualización del rostro"
                                className="w-32 h-32 rounded-full object-cover shadow-md border border-gray-200"
                            />
                        </div>
                    )}

                    <input
                        type="file"
                        id="face_reference_image"
                        ref={fileInputRef}
                        className="mt-2 block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-semibold
                            file:bg-indigo-50 file:text-indigo-700
                            hover:file:bg-indigo-100"
                        accept="image/*"
                        capture="user"
                        onChange={handleFileChange}
                    />

                    <InputError className="mt-2" message={errors.face_reference_image} />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing || !data.face_reference_image}>Guardar Foto</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">Guardado exitosamente.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
