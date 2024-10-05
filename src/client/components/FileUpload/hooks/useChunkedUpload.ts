import axios from 'axios';

export const useChunkedUpload = (
    uploadUrl: string,
    chunkSize: number,
    updateProgress: (fileName: string, progress: number) => void,
    onComplete?: (file: File, response: any) => void,
    onError?: (file: File, error: any) => void
) => {
    const uploadFileInChunks = async (file: File) => {
        const totalChunks = Math.ceil(file.size / chunkSize);
        let currentChunkIndex = 0;

        const uploadNextChunk = async () => {
            const start = currentChunkIndex * chunkSize;
            const end = Math.min(file.size, start + chunkSize);
            const chunk = file.slice(start, end);

            const formData = new FormData();
            formData.append('file', chunk, file.name);
            formData.append('currentChunkIndex', String(currentChunkIndex));
            formData.append('totalChunks', String(totalChunks));

            try {
                const response = await axios.post(uploadUrl, formData, {
                    onUploadProgress: (progressEvent) => {
                        if (progressEvent.total) {
                            const percentComplete = Math.round(
                                ((currentChunkIndex * chunkSize + progressEvent.loaded) / file.size) * 100
                            );
                            updateProgress(file.name, percentComplete);
                        }
                    },
                });

                currentChunkIndex++;

                if (currentChunkIndex < totalChunks) {
                    await uploadNextChunk();
                } else if (onComplete) {
                    onComplete(file, response.data);
                }
            } catch (error) {
                if (onError) {
                    onError(file, new Error(`Chunk ${currentChunkIndex + 1} failed`));
                }
            }
        };

        await uploadNextChunk();
    };

    return { uploadFileInChunks };
};
