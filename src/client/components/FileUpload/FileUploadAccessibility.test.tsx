import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import FileUpload from './FileUpload';
import FileInput from './FileInput';
import FileListView from './FileListView';
import UploadedFilesView from './UploadedFilesView';

// Note: this test does not guarantee fully accessiblity of the component
expect.extend(toHaveNoViolations);

describe('FileUpload accessibility', () => {
    it('should have no accessibility violations', async () => {
        const { container } = render(
            <>
                <FileUpload
                    InputComponent={FileInput}
                    FileViewComponent={FileListView}
                    singleUploadUrl="/api/upload-single"
                    chunkUploadUrl="/api/upload-chunk"
                />
                <UploadedFilesView filesListUrl="/api/files" />
            </>
        );

        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
