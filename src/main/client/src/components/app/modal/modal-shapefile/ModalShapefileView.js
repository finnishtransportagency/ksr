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

const ModalShapefileView = ({
    onDrop,
    acceptedFiles,
    color,
    setColor,
}: Props) => (
    <Fragment>
        <ShapefileDropView onDrop={onDrop} acceptedFiles={acceptedFiles} />
        <ShapefileColorView color={color} setColor={setColor} />
    </Fragment>
);

export default ModalShapefileView;
