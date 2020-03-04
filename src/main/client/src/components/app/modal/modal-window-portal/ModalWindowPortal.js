// @flow
import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import './styles.css';
import TableContainer from '../../table/TableContainer';

type Props = {
    setActivePortal: (portal: string) => void,
};

type State = {
    externalWindow: any,
    elementContainer: any,
};

const initialState = {
    externalWindow: null,
    elementContainer: null,
};

class ModalWindowPortal extends Component<Props, State> {
    constructor(props: any) {
        super(props);

        this.state = { ...initialState };
        this.handleClose = this.handleClose.bind(this);
    }

    componentDidMount() {
        let { externalWindow, elementContainer } = this.state;
        externalWindow = window.open('', '', `width=${window.screen.availWidth},height=${window.screen.availHeight - 58}`);
        externalWindow.document.title = 'Taulu - Kiinteistö- ja sopimusrekisteri';
        elementContainer = document.createElement('div');
        elementContainer.classList.add('windowPortalClass');
        externalWindow.document.body.appendChild(elementContainer);
        this.setState({ externalWindow, elementContainer });
        this.copyStyles(document, externalWindow.document);
        externalWindow.onbeforeunload = this.handleClose;
        externalWindow.moveTo(0, 0);
        externalWindow.resizeTo(window.screen.width, window.screen.height);
        window.addEventListener('windowPortalUpdate', () => {
            this.copyStyles(document, externalWindow.document);
            this.render();
        });
    }

    handleClose = () => {
        const { setActivePortal } = this.props;
        const { externalWindow } = this.state;
        setActivePortal('');
        window.removeEventListener('beforeunload', this.handleClose.bind(this));
        externalWindow.close();
    }

    copyStyles = (sourceDoc: any, targetDoc: any) => {
        Array.from(sourceDoc.styleSheets).forEach((styleSheet) => {
            targetDoc.head.appendChild(styleSheet.ownerNode.cloneNode(true));
        });
    }

    render() {
        const { elementContainer } = this.state;

        if (elementContainer) {
            return createPortal(
                <TableContainer />,
                elementContainer,
            );
        }

        return null;
    }
}

export default ModalWindowPortal;
