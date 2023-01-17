// @flow
import React, { Fragment } from 'react';
import strings from '../../../../translations';
import { RadioWrapper } from '../../side-bar/search/styles';
import Radiobutton from '../../../ui/blocks/Radiobutton';
import { ModalExtractSelectedWrapper, OutputWrapper } from './styles';
import LoadingIcon from '../../shared/LoadingIcon';

type Props = {
    activeFormat: string,
    downloadFormat: string,
    handleRadioChange: Function,
    outputLink: string,
    extracting: boolean,
};

function ModalExtractSelectedView({
    activeFormat,
    downloadFormat,
    handleRadioChange,
    outputLink,
    extracting,
}: Props) {
    return (
        <>
            <p>{strings.modalExtractSelectedData.description}</p>
            <ModalExtractSelectedWrapper>
                <RadioWrapper>
                    <Radiobutton htmlFor="shapefile">
                        {strings.modalExtractSelectedData.shapefile}
                        <Radiobutton.Input
                            checked={activeFormat === 'Shapefile - SHP - .shp'}
                            type="radio"
                            id="shapefile"
                            value="Shapefile - SHP - .shp"
                            onChange={handleRadioChange}
                        />
                        <Radiobutton.Checkmark />
                    </Radiobutton>
                    <Radiobutton htmlFor="geodatabase">
                        {strings.modalExtractSelectedData.geodatabase}
                        <Radiobutton.Input
                            checked={activeFormat === 'File Geodatabase - GDB - .gdb'}
                            type="radio"
                            id="geodatabase"
                            value="File Geodatabase - GDB - .gdb"
                            onChange={handleRadioChange}
                        />
                        <Radiobutton.Checkmark />
                    </Radiobutton>
                    <Radiobutton htmlFor="autocad-dxf">
                        {strings.modalExtractSelectedData.autocadDxf}
                        <Radiobutton.Input
                            checked={activeFormat === 'Autodesk AutoCAD - DXF_R2007 - .dxf'}
                            type="radio"
                            id="autocad-dxf"
                            value="Autodesk AutoCAD - DXF_R2007 - .dxf"
                            onChange={handleRadioChange}
                        />
                        <Radiobutton.Checkmark />
                    </Radiobutton>
                    <Radiobutton htmlFor="autocad-dwg">
                        {strings.modalExtractSelectedData.autocadDwg}
                        <Radiobutton.Input
                            checked={activeFormat === 'Autodesk AutoCAD - DWG_R2013 - .dwg'}
                            type="radio"
                            id="autocad-dwg"
                            value="Autodesk AutoCAD - DWG_R2013 - .dwg"
                            onChange={handleRadioChange}
                        />
                        <Radiobutton.Checkmark />
                    </Radiobutton>
                    <Radiobutton htmlFor="bentley">
                        {strings.modalExtractSelectedData.bentley}
                        <Radiobutton.Input
                            checked={activeFormat === 'Bentley Microstation Design (V8) - DGN_V8 - .dgn'}
                            type="radio"
                            id="bentley"
                            value="Bentley Microstation Design (V8) - DGN_V8 - .dgn"
                            onChange={handleRadioChange}
                        />
                        <Radiobutton.Checkmark />
                    </Radiobutton>
                </RadioWrapper>
                <OutputWrapper>
                    <LoadingIcon loading={extracting} size={8} />
                    {
                        outputLink
                    && (
                        <a href={outputLink} download={strings.modalExtractSelectedData.outputName}>
                            <i className="esri-icon-download" />
                            <span>
                                {strings.modalExtractSelectedData.outputSuccess}
                                {' '}
                                {downloadFormat}
                            </span>
                        </a>
                    )
                    }
                    {
                        !outputLink && !extracting
                    && <span>{strings.modalExtractSelectedData.outputEmpty}</span>
                    }
                </OutputWrapper>
            </ModalExtractSelectedWrapper>
        </>
    );
}

export default ModalExtractSelectedView;
