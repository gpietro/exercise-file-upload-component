import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FileUpload from './FileUpload';
import { useSingleUpload } from './hooks/useSingleUpload';
import { useChunkedUpload } from './hooks/useChunkedUpload';
import { useUploadProgress } from './hooks/useUploadProgress';

jest.mock('./hooks/useSingleUpload');
jest.mock('./hooks/useChunkedUpload');
jest.mock('./hooks/useUploadProgress');

describe('FileUpload', () => {
    const mockInputComponent = ({ onFileSelect }: { onFileSelect: (files: File[]) => void }) => (
        <input
            type="file"
            data-testid="file-input"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.files) {
                    onFileSelect(Array.from(e.target.files));
                }
            }}
        />
    );

    const mockFileViewComponent = ({
        currentFiles,
        uploadProgress,
    }: {
        currentFiles: File[];
        uploadProgress: { [key: string]: number };
    }) => (
        <ul>
            {currentFiles.map((file) => (
                <li key={file.name}>
                    {file.name} - {uploadProgress[file.name] || 0}% uploaded
                </li>
            ))}
        </ul>
    );

    const mockUpdateProgress = jest.fn();
    const mockSingleUpload = jest.fn();
    const mockChunkedUpload = jest.fn();

    beforeEach(() => {
        (useSingleUpload as jest.Mock).mockReturnValue({
            uploadFileSingle: mockSingleUpload,
        });
        (useChunkedUpload as jest.Mock).mockReturnValue({
            uploadFileInChunks: mockChunkedUpload,
        });
        (useUploadProgress as jest.Mock).mockReturnValue({
            uploadProgress: {},
            updateProgress: mockUpdateProgress,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should call single file upload for files under the threshold', () => {
        const singleUploadUrl = '/api/upload-single';
        const chunkUploadUrl = '/api/upload-chunk';
        const fileSizeThreshold = 1024 * 1024; // 1MB

        render(
            <FileUpload
                InputComponent={mockInputComponent}
                FileViewComponent={mockFileViewComponent}
                singleUploadUrl={singleUploadUrl}
                chunkUploadUrl={chunkUploadUrl}
                fileSizeThreshold={fileSizeThreshold}
            />
        );

        const file = new File(['small file content'], 'small-file.txt', { type: 'text/plain' });
        const input = screen.getByTestId('file-input');
        fireEvent.change(input, { target: { files: [file] } });

        expect(mockSingleUpload).toHaveBeenCalledWith(file);
        expect(mockChunkedUpload).not.toHaveBeenCalled();
    });

    it('should call chunked file upload for files over the threshold', () => {
        const singleUploadUrl = '/api/upload-single';
        const chunkUploadUrl = '/api/upload-chunk';
        const fileSizeThreshold = 1024 * 1024; // 1MB

        render(
            <FileUpload
                InputComponent={mockInputComponent}
                FileViewComponent={mockFileViewComponent}
                singleUploadUrl={singleUploadUrl}
                chunkUploadUrl={chunkUploadUrl}
                fileSizeThreshold={fileSizeThreshold}
            />
        );

        const largeFile = new File(['large file content'], 'large-file.txt', { type: 'text/plain' });
        Object.defineProperty(largeFile, 'size', { value: fileSizeThreshold + 1 });

        const input = screen.getByTestId('file-input');
        fireEvent.change(input, { target: { files: [largeFile] } });

        expect(mockChunkedUpload).toHaveBeenCalledWith(largeFile);
        expect(mockSingleUpload).not.toHaveBeenCalled();
    });

    it('should display file names and upload progress', () => {
        const singleUploadUrl = '/api/upload-single';
        const chunkUploadUrl = '/api/upload-chunk';

        (useUploadProgress as jest.Mock).mockReturnValue({
            uploadProgress: { 'file1.txt': 50, 'file2.txt': 80 },
            updateProgress: mockUpdateProgress,
        });

        render(
            <FileUpload
                InputComponent={mockInputComponent}
                FileViewComponent={mockFileViewComponent}
                singleUploadUrl={singleUploadUrl}
                chunkUploadUrl={chunkUploadUrl}
            />
        );

        const file1 = new File(['file1 content'], 'file1.txt', { type: 'text/plain' });
        const file2 = new File(['file2 content'], 'file2.txt', { type: 'text/plain' });

        const input = screen.getByTestId('file-input');
        fireEvent.change(input, { target: { files: [file1, file2] } });

        expect(screen.getByText('file1.txt - 50% uploaded')).toBeInTheDocument();
        expect(screen.getByText('file2.txt - 80% uploaded')).toBeInTheDocument();
    });
});
