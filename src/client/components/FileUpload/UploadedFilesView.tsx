import React, { useEffect } from 'react';
import { useFileList } from './hooks/useFileList';

interface PreviouslyUploadedFilesProps {
    filesListUrl: string;
}

// TODO: add extensibility as FileUpload with different types of view supported
const UploadedFiles: React.FC<PreviouslyUploadedFilesProps> = ({ filesListUrl }) => {
    const { uploadedFiles, loading, error, fetchUploadedFiles } = useFileList(filesListUrl);

    useEffect(() => {
        fetchUploadedFiles();
    }, [filesListUrl]);

    if (loading) {
        return <div>Loading previously uploaded files...</div>;
    }

    if (error) {
        return <div>Error fetching files: {error}</div>;
    }

    return (
        <div>
            <ul>
                {uploadedFiles.map((file, index) => (
                    <li key={index}>
                        {file.name} ({(file.size / 1024).toFixed(2)} KB)
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UploadedFiles;
