import { render } from '@testing-library/react';
import FileListView from './FileListView';

describe('FileListView', () => {
    it('should display file names and their upload progress', () => {
        const mockFiles = [
            new File(['file1 content'], 'file1.txt', { type: 'text/plain' }),
            new File(['file2 content'], 'file2.txt', { type: 'text/plain' }),
        ];

        const mockUploadProgress = {
            'file1.txt': 50,
            'file2.txt': 80,
        };

        const { container } = render(<FileListView currentFiles={mockFiles} uploadProgress={mockUploadProgress} />);

        expect(container.textContent).toContain('file1.txt - 50% uploaded');
        expect(container.textContent).toContain('file2.txt - 80% uploaded');
    });

    it('should default to 0% upload progress if not provided', () => {
        const mockFiles = [new File(['file3 content'], 'file3.txt', { type: 'text/plain' })];

        const mockUploadProgress = {}; // No upload progress data

        const { container } = render(<FileListView currentFiles={mockFiles} uploadProgress={mockUploadProgress} />);

        expect(container.textContent).toContain('file3.txt - 0% uploaded');
    });
});
