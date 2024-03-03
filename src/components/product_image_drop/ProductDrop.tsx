import { FileArrowDown } from '@phosphor-icons/react';
import { useCallback, useState } from 'react'
import { Image } from 'react-bootstrap'
import { useDropzone } from 'react-dropzone'

interface productProps {
    onImageDrop?: (file: never) => void
    errorStatus?: boolean
    imageLink?: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ProductDrop({imageLink , onImageDrop, errorStatus}: productProps): JSX.Element {
    const [showOverlay, setShowOverlay] = useState(false)
    const [imagePreview, setImagePreview] = useState<string | null>(null)

    const onDrop = useCallback((aceptedFiles: unknown[]) => {
        const file = aceptedFiles[0];

        const reader = new FileReader();
        reader.onload = () => {
            setImagePreview(reader.result as string)
        }

        reader.readAsDataURL(file as Blob)

        if (onImageDrop) {
            onImageDrop(file as never);
        }
    }, [onImageDrop])


    const handleMouseEnter = () => {
        setShowOverlay(true)
    }

    const handleMouseLeave = () => {
        setShowOverlay(false)
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: false })

    return (
        <section {...getRootProps()} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <input {...getInputProps()} />
            {isDragActive ? (
                <div className='flex flex-col gap-2'>
                    <Image src={imagePreview || imageLink || "/img/placeholder.jpg"} rounded width={250} alt="Placeholder" className={!errorStatus ? 'w-[250px] h-[350px] object-cover' : 'w-[250px] h-[350px] object-cover border-rose-500 border-[1px]'} />
                    <span className='font-blinker text-stone-500 select-none'>Solte a imagem aqui</span>
                    {isDragActive && (
                        <div className='bg-stone-700 bg-opacity-50 absolute h-[350px] w-[250px] flex items-center justify-center animate__animated animate__fadeIn'>
                            <FileArrowDown size={30} color='white' />
                        </div>
                    )}
                </div>
            ) : (
                <div className='flex flex-col gap-2'>
                    <Image src={imagePreview || imageLink || "/img/placeholder.jpg"} rounded width={250} className={!errorStatus ? 'w-[250px] h-[350px] object-cover' : 'w-[250px] h-[350px] object-cover border-rose-500 border-[1px]'} alt="Placeholder" />
                    <span className={!errorStatus? 'font-blinker text-stone-500 select-none' : 'font-blinker text-rose-500 select-none animate-bounce'}>{!errorStatus ? 'Arraste ou Clique na Imagem' : 'Atenção Imagem Obrigatória'}</span>
                    {showOverlay && (
                        <div className='bg-stone-700 bg-opacity-50 absolute h-[350px] w-[250px] flex items-center justify-center animate__animated animate__fadeIn'>
                            <FileArrowDown size={30} color='white' />
                        </div>
                    )}
                </div>
            )}
        </section>
    )
}

export default ProductDrop