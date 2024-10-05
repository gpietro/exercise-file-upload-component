import { type ReactElement } from 'react';
import FileUpload from './components/FileUpload/FileUpload';
import FileInput from './components/FileUpload/FileInput';
import FileListView from './components/FileUpload/FileListView';
import UploadedFiles from './components/FileUpload/UploadedFilesView';

export const App = (): ReactElement => {
    return (
        <main className="relative isolate h-dvh">
            <div className="mx-auto max-w-7xl px-6 py-32 sm:py-40 lg:px-8">
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-800 sm:text-5xl">Demo</h1>
                <p className="mt-4 mb-4 text-base text-gray-900 sm:mt-6">
                    Everything brand starts small, let&apos;s build something great.
                </p>
                <hr />
                <h1 className="mt-4 mb-4 text-3xl font-bold tracking-tight text-gray-800 sm:text-3xl">File upload</h1>
                <div className="mt-4 mb-4 text-base text-gray-900 sm:mt-6">
                    <FileUpload
                        InputComponent={FileInput}
                        FileViewComponent={FileListView}
                        singleUploadUrl="/api/upload-single"
                        chunkUploadUrl="/api/upload-chunk"
                        onComplete={(file, response) => console.log('Upload complete:', file, response)}
                        onError={(file, error) => console.error('Upload failed:', file, error)}
                    />
                </div>
                <div className="mt-4 mb-4 text-base text-gray-900 sm:mt-6">
                    <h1 className="mt-4 mb-4 text-3xl font-bold tracking-tight text-gray-800 sm:text-3xl">
                        Uploaded files
                    </h1>
                    <UploadedFiles filesListUrl="/api/files" />
                </div>
            </div>
        </main>
    );
};
