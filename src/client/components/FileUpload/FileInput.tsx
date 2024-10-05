import React, { ChangeEvent } from 'react';

interface FileInputProps {
    onFileSelect: (files: File[]) => void;
}

const FileInput: React.FC<FileInputProps> = ({ onFileSelect }) => {
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            onFileSelect(selectedFiles);
        }
    };

    return (
        <label htmlFor="file-input">
            <input
                type="file"
                id="file-input"
                multiple
                onChange={handleFileChange}
                aria-label="Select files"
                data-testid="file-input"
            />
        </label>
    );
};

export default FileInput;
