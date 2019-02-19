// @flow
import React from 'react';
import Dropzone from 'react-dropzone';
import { Button } from '../../../ui/elements/index';
import { DropzoneText } from './styles';
import strings from '../../../../translations/index';

type Props = {
    onDrop: Function,
    acceptedExtensions: string,
    fileUploadRef: () => void,
    closeModal: () => void,
};

const ModalShapefileView = ({
    onDrop, acceptedExtensions, fileUploadRef, closeModal,
}: Props) => (
    <Dropzone
        className="dropzone"
        ref={fileUploadRef}
        onDrop={onDrop}
        onFileDialogCancel={closeModal}
        multiple
        accept={acceptedExtensions}
    >
        {
            ({ getRootProps, getInputProps }) => (
                <DropzoneText {...getRootProps()}>
                    <p>{strings.dropzoneShape.dropText}</p>
                    <p>{strings.dropzoneShape.orText}</p>
                    <input {...getInputProps()} />
                    <Button>{strings.dropzoneShape.browse}</Button>
                </DropzoneText>
            )
        }
    </Dropzone>
);

export default ModalShapefileView;
