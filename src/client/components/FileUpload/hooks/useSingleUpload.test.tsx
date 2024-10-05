import { renderHook, act } from '@testing-library/react';
import axios from 'axios';
import { useSingleUpload } from './useSingleUpload';
import { AxiosProgressEvent } from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('useSingleUpload with axios', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should update progress during file upload', async () => {
        const updateProgress = jest.fn();
        const file = new File(['dummy content'], 'testFile.txt', { type: 'text/plain' });

        // Mock axios post method with progress handling
        mockedAxios.post.mockImplementation((_url, _formData, config) => {
            // Simulate progress event
            const progressEvent: AxiosProgressEvent = {
                loaded: 50,
                total: 100,
                lengthComputable: true, // Add required properties
                bytes: 50,
            };

            if (config && config.onUploadProgress) {
                config.onUploadProgress(progressEvent);
            }

            // Return a mock response
            return Promise.resolve({
                data: { success: true },
            });
        });

        const { result } = renderHook(() => useSingleUpload('/upload', updateProgress));

        // Act to trigger the upload
        act(() => {
            result.current.uploadFileSingle(file);
        });

        // Ensure progress is updated correctly
        expect(updateProgress).toHaveBeenCalledWith('testFile.txt', 50);
    });

    it('should call onComplete when upload succeeds', async () => {
        const updateProgress = jest.fn();
        const onComplete = jest.fn();
        const file = new File(['dummy content'], 'testFile.txt', { type: 'text/plain' });

        // Mock axios post method and simulate a successful upload
        mockedAxios.post.mockResolvedValue({ data: { success: true } });

        const { result } = renderHook(() => useSingleUpload('/upload', updateProgress, onComplete));

        // Act to trigger the upload
        await act(async () => {
            await result.current.uploadFileSingle(file);
        });

        // Ensure onComplete is called with correct response
        expect(onComplete).toHaveBeenCalledWith(file, { success: true });
    });

    it('should call onError when upload fails', async () => {
        const updateProgress = jest.fn();
        const onError = jest.fn();
        const file = new File(['dummy content'], 'testFile.txt', { type: 'text/plain' });

        // Mock axios post method to simulate an error
        mockedAxios.post.mockRejectedValue(new Error('Upload failed'));

        const { result } = renderHook(() => useSingleUpload('/upload', updateProgress, undefined, onError));

        // Act to trigger the upload
        await act(async () => {
            await result.current.uploadFileSingle(file);
        });

        // Ensure onError is called with the error
        expect(onError).toHaveBeenCalledWith(file, new Error('Upload failed'));
    });
});
