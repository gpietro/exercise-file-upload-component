# FileUpload Component

## Overview

The `FileUpload` component is a flexible solution for uploading files, supporting multiple input methods (file input, drag-and-drop, etc.) and displaying upload progress. It handles both single-file and chunked uploads based on file size, making it suitable for large file uploads.

The component is designed for easy extension, allowing additional input types, progress views, and file displays (e.g., previews or lists). This README covers its structure and usage.

## Component Structure

### Main Components

1. **FileUpload**: The core component responsible for handling file uploads, either in single chunks or as multi-part uploads.
2. **FileInput**: A standard HTML file input component for selecting files.
3. **DragAndDropInput**: An alternative input component that supports drag-and-drop functionality for file uploads.
4. **FileListView**: A component responsible for displaying the list of files being uploaded and showing their upload progress.
5. **UploadedFilesView**: A component used to fetch and display the list of files that have already been uploaded.

6. **Hooks**:
    - `useSingleUpload`: Handles the upload of small files in a single transaction.
    - `useChunkedUpload`: Manages the chunked upload of larger files.
    - `useUploadProgress`: Tracks and updates the upload progress of each file.
    - `useFileList`: Fetches the list of previously uploaded files from the server.

## Usage

### Basic Usage (With Standard File Input)

```ts
import FileUpload from './FileUpload';
import FileInput from './FileInput';
import FileListView from './FileListView';

const App: React.FC = () => {
    return (
        <>
            <FileUpload
                InputComponent={FileInput}
                FileViewComponent={FileListView}
                singleUploadUrl="/api/upload-single"
                chunkUploadUrl="/api/upload-chunk"
            />
            <UploadedFiles filesListUrl="/api/files" />
        </>
    );
};
```

### With Drag-and-Drop input

```ts
import FileUpload from './FileUpload';
import DragAndDropInput from './DragAndDropInput';
import FileListView from './FileListView';

const App: React.FC = () => {
    return (
        <>
            <FileUpload
                InputComponent={DragAndDropInput}
                FileViewComponent={FileListView}
                singleUploadUrl="/api/upload-single"
                chunkUploadUrl="/api/upload-chunk"
            />
            <UploadedFiles filesListUrl="/api/files" />
        </>
    );
};

```

## API Reference

### FileUpload Props

| Prop                | Type                                                                            | Description                                                                                     |
| ------------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `InputComponent`    | `React.FC<{ onFileSelect: (files: File[]) => void }>`                           | The component responsible for selecting files (e.g., file input or drag-and-drop).              |
| `FileViewComponent` | `React.FC<{ currentFiles: File[]; uploadProgress: { [key: string]: number } }>` | The component responsible for displaying the list of files being uploaded and showing progress. |
| `singleUploadUrl`   | `string`                                                                        | The API endpoint for uploading small files in a single request.                                 |
| `chunkUploadUrl`    | `string`                                                                        | The API endpoint for uploading large files in chunks.                                           |
| `chunkSize`         | `number` (optional)                                                             | The size of each chunk when uploading large files (default: 5MB).                               |
| `fileSizeThreshold` | `number` (optional)                                                             | The file size threshold above which chunked upload is used (default: 1MB).                      |
| `onComplete`        | `(file: File, response: any) => void` (optional)                                | Callback when a file has been successfully uploaded.                                            |
| `onError`           | `(file: File, error: any) => void` (optional)                                   | Callback when a file fails to upload.                                                           |

### UploadedFilesView Props

| Prop           | Type     | Description                                                          |
| -------------- | -------- | -------------------------------------------------------------------- |
| `filesListUrl` | `string` | The API endpoint for fetching the list of previously uploaded files. |

## To-Do List

1. Refactoring: Modularize UploadedFilesView:
   The UploadedFilesView component should be further modularized to support different display types (e.g., image preview, list of filenames) in a more extensible way.
2. Accessibility Testing:
   Basic accessibility test is in place, but further testing is needed to ensure compliance with accessibility standards (WCAG).
3. Add Styling:
   The component currently has minimal or no styling.
