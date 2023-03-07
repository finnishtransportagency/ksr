// @flow
import React, { Fragment } from 'react';
import ShapefileColorView from './shapefile-color/ShapefileColorView';
import ShapefileDropView from './shapefile-drop/ShapefileDropView';

type Props = {
    onDrop: Function,
    acceptedFiles: any[],
    color: ?string,
    setColor: (string) => void,
};

function ModalShapefileView({
    onDrop,
    acceptedFiles,
    color,
    setColor,
}: Props): React$Element<React$FragmentType> {
    return (
        <>
            <ShapefileDropView onDrop={onDrop} acceptedFiles={acceptedFiles} />
            <ShapefileColorView color={color} setColor={setColor} />
        </>
    );
}

export default ModalShapefileView;
