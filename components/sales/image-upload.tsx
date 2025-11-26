'use client';

import { useDropzone } from 'react-dropzone';
import { useState } from 'react';
import { apiClient } from '@/lib/api/client';

export function ImageUpload({ onUploadComplete }: { onUploadComplete: (url: string) => void }) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    const { getRootProps, getInputProps } = useDropzone({
        accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
        maxSize: 5242880, // 5MB
        multiple: false,
        onDrop: async (acceptedFiles) => {
            const file = acceptedFiles[0];
            if (!file) return;

            // Preview local
            setPreview(URL.createObjectURL(file));
            setUploading(true);

            try {
                const formData = new FormData();
                formData.append('file', file);

                const { data } = await apiClient.post('/cloudinary/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });

                onUploadComplete(data.url);
            } catch (error) {
                console.error('Upload failed:', error);
            } finally {
                setUploading(false);
            }
        },
    });

    return (
        <div>
            <div
                {...getRootProps()}
                className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary"
            >
                <input {...getInputProps()} />
                {preview ? (
                    <img src={preview} alt="Preview" className="max-h-48 mx-auto" />
                ) : (
                    <div>
                        <p>📷 Arrastra una imagen aquí</p>
                        <p className="text-sm text-muted-foreground">o haz click para buscar</p>
                    </div>
                )}
            </div>
            {uploading && <p className="text-sm text-center mt-2">Subiendo...</p>}
        </div>
    );
}
