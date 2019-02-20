// @flow
import React, { Component, createRef, Fragment } from 'react';
import MediaQuery from 'react-responsive';
import ModalContainer from '../../shared/Modal/ModalContainer';
import strings from '../../../../translations/index';
import ModalShapefileView from './ModalShapefileView';
import { shape2geoJson } from '../../../../utils/shape2geojson';

type State = {
    acceptedFileExtensions: string,
};
type Props = {
    view: Object,
    setActiveModal: Function,
    layerList: Array<any>,
    addShapefile: Function,
    toggleDropzoneActive: Function,
    dropzone: boolean,
};
const initialState = {
    acceptedFileExtensions: '.shp,.dbf',
};

class ModalShapefile extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { ...initialState };

        this.fileMobileUpload = createRef();
        this.onDrop = this.onDrop.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    componentDidMount() {
        const { dropzone, toggleDropzoneActive } = this.props;
        if (dropzone) {
            const fileUpload = this.fileMobileUpload.current;
            if (fileUpload !== null) {
                this.fileMobileUpload.current.open();
                toggleDropzoneActive();
            }
        }
    }

    onDrop = async (acceptedFiles: any) => {
        if (acceptedFiles.length < 1) return;

        const { layerList, view, addShapefile } = this.props;

        const fileName = acceptedFiles.find(a => a).name.split('.').shift();

        if (layerList.some(l => l.name === fileName)) {
            return;
        }

        const contents = {};
        await Promise.all(acceptedFiles.map(file => this.readFile(file, contents)));
        shape2geoJson(
            contents,
            fileName,
            view,
            layerList,
            addShapefile,
        );
        this.closeModal();
    };

    readFile = (file: any, contents: any): Promise<void> => new Promise((resolve) => {
        if (file.name.split('.').pop() === 'shp' || file.name.split('.').pop() === 'dbf') {
            const reader = new FileReader();
            reader.onload = (event) => {
                const name = file.name.split('.').pop();
                contents[name] = event.target.result.slice(0);
                resolve();
            };
            reader.readAsArrayBuffer(file);
        }
    });

    closeModal = () => {
        const { setActiveModal } = this.props;
        setActiveModal('');
    };

    // Assign constructor ref flowtypes
    fileMobileUpload: any;

    render() {
        const { acceptedFileExtensions } = this.state;
        return (
            <Fragment>
                <MediaQuery query="(min-width: 769px)">
                    <ModalContainer
                        title={strings.modalShapefile.title}
                        modalSubmit={[]}
                    >
                        <ModalShapefileView
                            onDrop={this.onDrop}
                            acceptedExtensions={acceptedFileExtensions}
                            fileUploadRef={this.fileMobileUpload}
                            closeModal={this.closeModal}
                        />
                    </ModalContainer>
                </MediaQuery>
                <MediaQuery query="(max-width: 768px)">
                    <ModalShapefileView
                        onDrop={this.onDrop}
                        acceptedExtensions={acceptedFileExtensions}
                        fileUploadRef={this.fileMobileUpload}
                        closeModal={this.closeModal}
                    />
                </MediaQuery>
            </Fragment>
        );
    }
}

export default ModalShapefile;
