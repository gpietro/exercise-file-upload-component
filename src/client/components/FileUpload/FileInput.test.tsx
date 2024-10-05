import { render, fireEvent } from '@testing-library/react';
import FileInput from './FileInput';

describe('FileInput component', () => {
    it('should call onFileSelect with selected files', () => {
        const mockOnFileSelect = jest.fn();

        const { getByTestId } = render(<FileInput onFileSelect={mockOnFileSelect} />);

        // Select the file input element by data-testid
        const inputElement = getByTestId('file-input');
        const file1 = new File(['file-content-1'], 'file1.txt', { type: 'text/plain' });
        const file2 = new File(['file-content-2'], 'file2.txt', { type: 'text/plain' });

        // Fire the change event with the selected files
        fireEvent.change(inputElement, { target: { files: [file1, file2] } });

        expect(mockOnFileSelect).toHaveBeenCalledTimes(1);
        expect(mockOnFileSelect).toHaveBeenCalledWith([file1, file2]);
    });
});
