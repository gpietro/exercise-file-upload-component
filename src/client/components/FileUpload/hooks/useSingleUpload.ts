import axios from 'axios';

export const useSingleUpload = (
    uploadUrl: string,
    updateProgress: (fileName: string, progress: number) => void,
    onComplete?: (file: File, response: any) => void,
    onError?: (file: File, error: any) => void
) => {
    const uploadFileSingle = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(uploadUrl, formData, {
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percentComplete = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        updateProgress(file.name, percentComplete);
                    }
                },
            });

            if (onComplete) {
                onComplete(file, response.data);
            }
        } catch (error) {
            if (onError) {
                onError(file, error);
            }
        }
    };

    return { uploadFileSingle };
};
