import { renderHook, act } from '@testing-library/react';
import { useFileList } from './useFileList';

global.fetch = jest.fn();

describe('useFileList hook', () => {
    const filesListUrl = '/api/files';

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch uploaded files successfully', async () => {
        const mockFiles = [
            { name: 'file1.txt', size: 1234 },
            { name: 'file2.txt', size: 5678 },
        ];

        // Mock the fetch response
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce({ files: mockFiles }),
        });

        const { result } = renderHook(() => useFileList(filesListUrl));

        // Initially, the loading state should be false
        expect(result.current.loading).toBe(false);
        expect(result.current.uploadedFiles).toEqual([]);
        expect(result.current.error).toBe(null);

        // Trigger the fetchUploadedFiles function
        await act(async () => {
            await result.current.fetchUploadedFiles();
        });

        // Check the results after fetching
        expect(result.current.uploadedFiles).toEqual(mockFiles);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(null);
    });

    it('should handle error during fetching', async () => {
        // Mock the fetch to return an error
        (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

        const { result } = renderHook(() => useFileList(filesListUrl));

        // Trigger the fetchUploadedFiles function
        await act(async () => {
            await result.current.fetchUploadedFiles();
        });

        // Check the error state
        expect(result.current.uploadedFiles).toEqual([]);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe('Network error');
    });

    it('should handle failed fetch response', async () => {
        // Mock the fetch response to simulate an unsuccessful request
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            json: jest.fn().mockResolvedValueOnce({}),
        });

        const { result } = renderHook(() => useFileList(filesListUrl));

        // Trigger the fetchUploadedFiles function
        await act(async () => {
            await result.current.fetchUploadedFiles();
        });

        // Check the error state after a failed fetch
        expect(result.current.uploadedFiles).toEqual([]);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe('Failed to fetch uploaded files');
    });
});
