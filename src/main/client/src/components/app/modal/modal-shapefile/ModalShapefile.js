// @flow
import React, { Component, Fragment } from 'react';
import { toast } from 'react-toastify';
import ModalContainer from '../../shared/Modal/ModalContainer';
import strings from '../../../../translations/index';
import ModalShapefileView from './ModalShapefileView';
import { shape2geoJson, convertLayerListFormat } from '../../../../utils/shape2geojson';

type State = {
    color: ?string,
    acceptedFiles: File[],
};

type Props = {
    view: Object,
    setActiveModal: Function,
    layerList: Array<any>,
    addShapefile: Function,
    addShapeFeaturesToTable: Function,
};

const initialState = {
    acceptedFiles: [],
    color: '',
};

const getFileByExtension = (files: any, extension: any) => files
    && files.find(file => file
        && file.name
        && file.name.split('.').pop() === extension);

class ModalShapefile extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { ...initialState };
    }

    onDrop: any = (acceptedFiles: File[]) => {
        this.setState({ acceptedFiles });
    };

    onSubmit: any = async () => {
        const { acceptedFiles, color } = this.state;
        const {
            layerList, view, addShapefile, addShapeFeaturesToTable,
        } = this.props;

        const shapeFile = getFileByExtension(acceptedFiles, 'shp');
        const dbfFile = getFileByExtension(acceptedFiles, 'dbf');

        const layerName = shapeFile && shapeFile.name && shapeFile.name.split('.')[0];
        if (!layerName || layerList.some(l => l.name === layerName)) {
            toast.error(strings.modalShapefile.layerExists);
            return;
        }

        const shp = shapeFile && await this.readFile(shapeFile);
        const dbf = dbfFile && await this.readFile(dbfFile);

        const layerId = Math.max(
            0, // Initial value for an empty array
            ...layerList.map(ll => parseInt(ll.id, 10)),
        ) + 11000;

        if (shp && dbf) {
            const layer = await shape2geoJson(
                shp,
                dbf,
                layerName,
                layerId,
                color,
            );
            if (layer) {
                view.map.add(layer);
                if (layer.source) view.goTo(layer.source.items);
                addShapeFeaturesToTable({ layers: [layer] });
                const definition = convertLayerListFormat(layer);
                addShapefile(definition);
            }
        } else {
            toast.error(strings.modalShapefile.readError);
        }

        this.closeModal();
    };

    readFile: any = (file: File): Promise<ArrayBuffer> => new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event: any) => {
            resolve(event.target.result);
        };
        reader.readAsArrayBuffer(file);
    });

    setColor: any = (color: string) => {
        this.setState({ color });
    };

    closeModal: any = () => {
        const { setActiveModal } = this.props;
        setActiveModal('');
    };

    render(): any {
        const { acceptedFiles, color } = this.state;
        const hasShp = Boolean(getFileByExtension(acceptedFiles, 'shp'));
        const hasDbf = Boolean(getFileByExtension(acceptedFiles, 'dbf'));

        const modalSubmit = [{
            text: strings.modalShapefile.submitText,
            handleSubmit: this.onSubmit,
            disabled: color === '' || !(hasShp && hasDbf),
            toggleModal: true,
        }];

        return (
            <ModalContainer
                title={strings.modalShapefile.title}
                modalSubmit={modalSubmit}
                cancelText={strings.modalShapefile.cancelText}
            >
                <ModalShapefileView
                    onDrop={this.onDrop}
                    acceptedFiles={acceptedFiles}
                    color={color}
                    setColor={this.setColor}
                />
            </ModalContainer>
        );
    }
}

export default ModalShapefile;
