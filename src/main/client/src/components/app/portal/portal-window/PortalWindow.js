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
        const base: any = document.createElement('base');
        // eslint-disable-next-line no-restricted-globals
        base.href = `${location.origin}${location.pathname}`;
        externalWindow.document.head.appendChild(base);
        externalWindow.document.title = strings.portalWindow.portalTitle;
        elementContainer = document.createElement('div');
        externalWindow.document.body.appendChild(elementContainer);
        externalWindow.document.title = strings.portalWindow.portalTitle;
        const base: any = document.createElement('base');
        // eslint-disable-next-line no-restricted-globals
        base.href = `${location.origin}${location.pathname}`;
        externalWindow.document.head.appendChild(base);
        this.setState({ externalWindow, elementContainer });
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
            try {
                if (styleSheet.cssRules) {
                    const newStyleEl = sourceDoc.createElement('style');

                    Array.from(styleSheet.cssRules).forEach((cssRule) => {
                        newStyleEl.appendChild(sourceDoc.createTextNode(cssRule.cssText));
                    });

                    targetDoc.head.appendChild(newStyleEl);
                } else {
                    const newLinkEl = sourceDoc.createElement('link');

                    newLinkEl.rel = 'stylesheet';
                    newLinkEl.href = styleSheet.href;
                    targetDoc.head.appendChild(newLinkEl);
                }
            } catch (e) {
                // no need to do anything - ignore
            }
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
