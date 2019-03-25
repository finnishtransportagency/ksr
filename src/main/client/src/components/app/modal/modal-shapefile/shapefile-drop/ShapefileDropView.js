// @flow
import React, { Fragment } from 'react';
import Dropzone from 'react-dropzone';
import { DropzoneContent } from './styles';
import strings from '../../../../../translations/index';
import { Button, H2 } from '../../../../ui/elements';

type Props = {
    onDrop: Function,
    acceptedFiles: File[],
};

const ShapefileDropView = ({ onDrop, acceptedFiles }: Props) => (
    <Fragment>
        <H2>{strings.shapefileDropView.title}</H2>
        <Dropzone className="dropzone" onDrop={onDrop} multiple accept=".shp,.dbf">
            {
                ({ getRootProps, getInputProps }) => (
                    <DropzoneContent
                        {...getRootProps()}
                        isValidFile={acceptedFiles.some(file => file.name.split('.').pop() === 'shp')}
                    >
                        {
                            acceptedFiles && acceptedFiles.length === 0 && (
                                <Fragment>
                                    <p>{strings.shapefileDropView.dropText}</p>
                                    <p>{strings.shapefileDropView.orText}</p>
                                </Fragment>
                            )
                        }
                        {
                            acceptedFiles && acceptedFiles.length > 0 && (
                                <Fragment>
                                    <p>{strings.shapefileDropView.selectedFilesText}</p>
                                    {
                                        acceptedFiles
                                            .map(file => <li key={file.name}>{file.name}</li>)
                                    }
                                </Fragment>
                            )
                        }
                        <input {...getInputProps()} />
                        <Button>{strings.shapefileDropView.browse}</Button>
                    </DropzoneContent>
                )
            }
        </Dropzone>
    </Fragment>
);

export default ShapefileDropView;
