import { useState } from 'react';

interface UploadedFile {
    name: string;
    size: number;
}

export const useFileList = (filesListUrl: string) => {
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUploadedFiles = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(filesListUrl);
            if (response.ok) {
                const data = await response.json();
                setUploadedFiles(data.files);
            } else {
                throw new Error('Failed to fetch uploaded files');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred while fetching files');
        } finally {
            setLoading(false);
        }
    };

    return { uploadedFiles, loading, error, fetchUploadedFiles };
};
