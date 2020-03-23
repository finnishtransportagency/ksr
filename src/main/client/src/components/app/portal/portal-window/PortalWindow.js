// @flow
import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import { PortalWrapper } from './styles';
import TableContainer from '../../table/TableContainer';
import strings from '../../../../translations';

type Props = {
    togglePortal: Function,
};

type State = {
    externalWindow: any,
    elementContainer: any,
};

const initialState = {
    externalWindow: null,
    elementContainer: null,
};

class PortalWindow extends Component<Props, State> {
    constructor(props: any) {
        super(props);

        this.state = { ...initialState };
        this.handleClose = this.handleClose.bind(this);
    }

    componentDidMount() {
        let { externalWindow, elementContainer } = this.state;
        externalWindow = window.open('', '', `width=${window.screen.availWidth},height=${window.screen.availHeight - 58}`);
        // eslint-disable-next-line no-restricted-globals
        externalWindow.document.write(`<base href="${location.origin}${location.pathname}">`);
        externalWindow.document.write('<html><head><link [href]=sanitizer.bypassSecurityTrustResourceUrl("css/all.min.css)" rel="stylesheet" type="text/css"></head></html>');
        externalWindow.document.title = strings.portalWindow.portalTitle;
        elementContainer = document.createElement('div');
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
        const { togglePortal } = this.props;
        const { externalWindow } = this.state;
        togglePortal();
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
                <PortalWrapper>
                    <TableContainer />
                </PortalWrapper>,
                elementContainer,
            );
        }

        return null;
    }
}

export default PortalWindow;
