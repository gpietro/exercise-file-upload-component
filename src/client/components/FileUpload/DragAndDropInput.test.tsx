import { render, fireEvent } from '@testing-library/react';
import DragAndDropInput from './DragAndDropInput';

describe('DragAndDropInput component', () => {
    it('should call onFileSelect when files are dropped', () => {
        const onFileSelect = jest.fn();

        const { getByText } = render(<DragAndDropInput onFileSelect={onFileSelect} />);

        const dropZone = getByText('Drag and drop files here');

        // Mock the dataTransfer object to simulate the file drop
        const file = new File(['file content'], 'test-file.txt', { type: 'text/plain' });
        const dataTransfer = {
            files: [file],
        };

        // Simulate the drop event
        fireEvent.drop(dropZone, {
            dataTransfer,
        });

        // Assert that onFileSelect is called with the dropped files
        expect(onFileSelect).toHaveBeenCalledWith([file]);
    });
});
