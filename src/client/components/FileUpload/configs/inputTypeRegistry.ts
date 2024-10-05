import FileInput from '../FileInput';
import DragAndDropInput from '../DragAndDropInput';

export const INPUT_TYPES = {
    FILE_INPUT: 'fileInput',
    DRAG_AND_DROP: 'dragAndDrop',
} as const;

export type InputType = (typeof INPUT_TYPES)[keyof typeof INPUT_TYPES];

// Extend to add new type of input
const inputTypeRegistry: { [key in InputType]: React.FC<{ onFileSelect: (files: File[]) => void }> } = {
    [INPUT_TYPES.FILE_INPUT]: FileInput,
    [INPUT_TYPES.DRAG_AND_DROP]: DragAndDropInput,
};

export default inputTypeRegistry;
