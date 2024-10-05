import { renderHook, act } from '@testing-library/react';
import axios from 'axios';
import { useChunkedUpload } from './useChunkedUpload';
import { AxiosProgressEvent } from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('useChunkedUpload with axios', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should upload file in chunks and track progress', async () => {
        const updateProgress = jest.fn();
        const onComplete = jest.fn();
        const onError = jest.fn();

        const file = new File(['A'.repeat(10 * 1024 * 1024)], 'testFile.txt', { type: 'text/plain' }); // 10MB file
        const chunkSize = 5 * 1024 * 1024; // 5MB chunk size

        mockedAxios.post.mockImplementation((_url, _formData, config) => {
            if (config && config.onUploadProgress) {
                const progressEvent: AxiosProgressEvent = {
                    loaded: chunkSize,
                    total: chunkSize,
                    lengthComputable: true,
                    bytes: chunkSize,
                };

                config.onUploadProgress(progressEvent);
            }

            return Promise.resolve({
                data: { success: true },
            });
        });

        const { result } = renderHook(() =>
            useChunkedUpload('/api/upload-chunk', chunkSize, updateProgress, onComplete, onError)
        );

        await act(async () => {
            await result.current.uploadFileInChunks(file);
        });

        expect(updateProgress).toHaveBeenNthCalledWith(1, 'testFile.txt', 50);
        expect(updateProgress).toHaveBeenNthCalledWith(2, 'testFile.txt', 100);

        expect(onComplete).toHaveBeenCalledWith(file, { success: true });

        expect(onError).not.toHaveBeenCalled();
    });

    it('should handle error during chunk upload', async () => {
        const updateProgress = jest.fn();
        const onComplete = jest.fn();
        const onError = jest.fn();

        const file = new File(['A'.repeat(10 * 1024 * 1024)], 'testFile.txt', { type: 'text/plain' }); // 10MB file
        const chunkSize = 5 * 1024 * 1024; // 5MB chunk size

        mockedAxios.post.mockRejectedValue(new Error('Chunk upload failed'));

        const { result } = renderHook(() =>
            useChunkedUpload('/api/upload-chunk', chunkSize, updateProgress, onComplete, onError)
        );

        await act(async () => {
            await result.current.uploadFileInChunks(file);
        });

        expect(onError).toHaveBeenCalledWith(file, new Error('Chunk 1 failed'));

        expect(onComplete).not.toHaveBeenCalled();
    });
});
