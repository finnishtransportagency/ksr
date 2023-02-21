// @flow
import React, { Component } from 'react';
import { createPortal } from 'react-dom';
import { PortalWrapper } from './styles';
import TableContainer from '../../table/TableContainer';
import strings from '../../../../translations';

type Props = {
    togglePortal: Function,
    activeTable: string,
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
        const font: any = document.createElement('link');
        font.href = 'https://fonts.googleapis.com/css?family=Exo+2:400,500';
        font.rel = 'stylesheet';
        externalWindow.document.head.appendChild(font);
        const allCss: any = document.createElement('link');
        allCss.href = '/css/all.min.css';
        allCss.rel = 'stylesheet';
        externalWindow.document.head.appendChild(allCss);
        externalWindow.document.title = strings.portalWindow.portalTitle;
        elementContainer = document.createElement('div');
        externalWindow.document.body.appendChild(elementContainer);
        this.setState({ externalWindow, elementContainer });
        externalWindow.onbeforeunload = this.handleClose;
        externalWindow.moveTo(0, 0);
        externalWindow.resizeTo(window.screen.width, window.screen.height);
        window.addEventListener('windowPortalUpdate', () => {
            this.render();
        });
    }

    handleClose: any = () => {
        const { togglePortal } = this.props;
        const { externalWindow } = this.state;
        togglePortal();
        window.removeEventListener('beforeunload', this.handleClose.bind(this));
        externalWindow.close();
    };

    copyStyles: any = (sourceDoc: any, targetDoc: any) => {
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
            targetDoc.head.appendChild(styleSheet.ownerNode.cloneNode(true));
        });
        Array.from(sourceDoc.fonts).forEach(font => targetDoc.fonts.add(font));
    };

    handleEmptyStyle: any = (externalWindow: any) => {
        externalWindow.document.body.style = 'margin: 0; background: #444444;';
    };

    render(): any {
        const { externalWindow, elementContainer } = this.state;
        const { activeTable } = this.props;

        if (!activeTable && externalWindow) {
            this.handleEmptyStyle(externalWindow);
        } else if (externalWindow && elementContainer) {
            this.copyStyles(document, externalWindow.document);
        }

        if (elementContainer && activeTable) {
            return createPortal(
                <PortalWrapper>
                    <TableContainer />
                </PortalWrapper>,
                elementContainer,
            );
        }

        if (elementContainer && !activeTable) {
            return createPortal(
                <div style={{
                    textAlign: 'center',
                    color: '#F1F1F1',
                    paddingTop: '80px',
                    fontFamily: '"Exo 2", Arial, sans-serif',
                    fontWeight: 400,
                }}
                >
                    {strings.table.noTableText}
                </div>,
                elementContainer,
            );
        }

        return null;
    }
}

export default PortalWindow;
