import React, { DragEvent } from 'react';

interface DragAndDropInputProps {
    onFileSelect: (files: File[]) => void;
}

const DragAndDropInput: React.FC<DragAndDropInputProps> = ({ onFileSelect }) => {
    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault(); // Ensure preventDefault is called
        const files = Array.from(e.dataTransfer.files);
        onFileSelect(files);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault(); // Ensure preventDefault is called
    };

    return (
        <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center' }}
        >
            Drag and drop files here
        </div>
    );
};

export default DragAndDropInput;
