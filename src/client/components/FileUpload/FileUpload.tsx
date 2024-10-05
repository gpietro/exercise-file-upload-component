// FileUpload.tsx
import React, { useState } from 'react';
import { useSingleUpload } from './hooks/useSingleUpload';
import { useChunkedUpload } from './hooks/useChunkedUpload';
import { useUploadProgress } from './hooks/useUploadProgress';
import { DEFAULT_CHUNK_SIZE, DEFAULT_FILE_SIZE_THRESHOLD } from './configs/uploadConfigs';

interface FileUploadProps {
    InputComponent: React.FC<{ onFileSelect: (files: File[]) => void }>;
    FileViewComponent: React.FC<{ currentFiles: File[]; uploadProgress: { [key: string]: number } }>;
    singleUploadUrl: string;
    chunkUploadUrl: string;
    chunkSize?: number;
    fileSizeThreshold?: number;
    onComplete?: (file: File, response: any) => void;
    onError?: (file: File, error: any) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
    InputComponent,
    FileViewComponent,
    singleUploadUrl,
    chunkUploadUrl,
    chunkSize = DEFAULT_CHUNK_SIZE,
    fileSizeThreshold = DEFAULT_FILE_SIZE_THRESHOLD,
    onComplete,
    onError,
}) => {
    const { uploadProgress, updateProgress } = useUploadProgress();
    const { uploadFileSingle } = useSingleUpload(singleUploadUrl, updateProgress, onComplete, onError);
    const { uploadFileInChunks } = useChunkedUpload(chunkUploadUrl, chunkSize, updateProgress, onComplete, onError);
    const [currentFiles, setCurrentFiles] = useState<File[]>([]);

    const handleFileSelect = (selectedFiles: File[]) => {
        setCurrentFiles(selectedFiles);
        selectedFiles.forEach((file) => {
            if (file.size <= fileSizeThreshold) {
                uploadFileSingle(file);
            } else {
                uploadFileInChunks(file);
            }
        });
    };

    return (
        <div>
            <InputComponent onFileSelect={handleFileSelect} />
            <FileViewComponent currentFiles={currentFiles} uploadProgress={uploadProgress} />
        </div>
    );
};

export default FileUpload;
