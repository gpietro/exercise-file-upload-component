import { renderHook, act } from '@testing-library/react';
import { useUploadProgress } from './useUploadProgress';

describe('useUploadProgress hook', () => {
    it('should initialize with no upload progress', () => {
        const { result } = renderHook(() => useUploadProgress());

        expect(result.current.uploadProgress).toEqual({});
    });

    it('should update progress for a file', () => {
        const { result } = renderHook(() => useUploadProgress());

        // Update progress for a file
        act(() => {
            result.current.updateProgress('testFile.txt', 50);
        });

        // Check the updated progress
        expect(result.current.uploadProgress).toEqual({ 'testFile.txt': 50 });
    });

    it('should update progress for multiple files', () => {
        const { result } = renderHook(() => useUploadProgress());

        act(() => {
            result.current.updateProgress('file1.txt', 30);
            result.current.updateProgress('file2.txt', 70);
        });

        expect(result.current.uploadProgress).toEqual({
            'file1.txt': 30,
            'file2.txt': 70,
        });
    });

    it('should update progress for the same file', () => {
        const { result } = renderHook(() => useUploadProgress());

        act(() => {
            result.current.updateProgress('testFile.txt', 50);
        });

        act(() => {
            result.current.updateProgress('testFile.txt', 100);
        });

        // Check if the progress was updated to 100%
        expect(result.current.uploadProgress).toEqual({ 'testFile.txt': 100 });
    });
});
