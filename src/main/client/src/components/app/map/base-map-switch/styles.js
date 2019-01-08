import styled, { css } from 'styled-components';

import { Button } from '../../../ui/elements';

const BaseMapContainer = styled.div`
    position: absolute;
    bottom: 16px;
    left: calc(60px * 2);
    height: 44px;
    width: calc(100vw - 60px * 2);
    background-color: rgba(255, 255, 255, 0.65);
    display: flex;
    transition: 0.3s;

    @media only screen and (max-width: 768px) {
        z-index: 2;
        left: 0;
        bottom: 76px;
        width: calc(100vw - 60px);
    };

    ${props => props.hidden && css`
        display: none;
    `}

    ${props => props.tableOpen && !props.sideBarOpen && !props.adminToolActive && css`
        bottom: calc(50vh + 16px);
        left: calc(60px * 6);
        width: calc(100vw - 60px * 6);
        @media only screen and (max-width: 768px) {
            display: none;
        };
    `};

    ${props => props.tableOpen && !props.sideBarOpen && props.adminToolActive && css`
        bottom: calc(50vh + 16px);
        left: calc(60px * 8);
        width: calc(100vw - 60px * 8);
        @media only screen and (max-width: 768px) {
            display: none;
        };
    `};

    ${props => !props.tableOpen && props.sideBarOpen && css`
        left: 520px;
        width: calc(100% - 400px - 60px * 2);
        @media only screen and (max-width: 768px) {
            display: none;
        };
    `};

    ${props => props.tableOpen && props.sideBarOpen && !props.adminToolActive && css`
        bottom: calc(50vh + 16px);
        left: calc(400px + 6 * 60px);
        width: calc(100vw - 400px - 60px * 6);
        @media only screen and (max-width: 768px) {
            display: none;
        };
    `};

    ${props => props.tableOpen && props.sideBarOpen && props.adminToolActive && css`
        bottom: calc(50vh + 16px);
        left: calc(400px + 8 * 60px);
        width: calc(100vw - 400px - 60px * 8);
        @media only screen and (max-width: 768px) {
            display: none;
        };
    `};

    ${props => props.tableOpen && css`
        @media only screen and (max-height: 820px) {
            display: none;
        };
    `};
`;

BaseMapContainer.displayName = 'BaseMapContainer';

const BaseMapButton = styled(Button)`
    flex: 1;
    margin: 5px;
    padding: 0.2rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

BaseMapButton.displayName = 'BaseMapButton';

export { BaseMapButton, BaseMapContainer };

