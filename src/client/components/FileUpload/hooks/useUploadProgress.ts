import { useState } from 'react';

export const useUploadProgress = () => {
    const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});

    const updateProgress = (fileName: string, progress: number) => {
        setUploadProgress((prevProgress) => ({
            ...prevProgress,
            [fileName]: progress,
        }));
    };

    return { uploadProgress, updateProgress };
};
