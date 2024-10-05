import React from 'react';

interface FileListViewProps {
    currentFiles: File[];
    uploadProgress: { [key: string]: number };
}

const FileListView: React.FC<FileListViewProps> = ({ currentFiles, uploadProgress }) => {
    return (
        <ul>
            {currentFiles.map((file, index) => (
                <li key={index}>
                    {file.name} - {uploadProgress[file.name] || 0}% uploaded
                </li>
            ))}
        </ul>
    );
};

export default FileListView;
