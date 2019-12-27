import styled, { css } from 'styled-components';
import { Button } from '../../../ui/elements';
import { MapLayerTitleWrapper, Icon } from '../../shared/styles';
import * as styles from '../../../ui/defaultStyles';

export const WrapperTabbedTable = styled.div`
    width: calc(100% - 60px);
    height: 58px;
    position: absolute;
    top: 0;
    white-space: nowrap;
    overflow: hidden;

    & > div > div {
        display: flex;
    }
    
    @media only screen and (max-width: 768px) {
        width: 100%;
    }
`;

export const ButtonWrapper = styled.div`
    display: flex;

    &:hover {
        background: rgba(0,0,0,0.1);
    }
`;

export const ButtonTabbedTableTab = styled(Button)`
    width: 120px;
    text-overflow: ellipsis;
    overflow: hidden;
    margin: 0;
    border-bottom: 5px solid transparent;
    height: 52px;
    color: ${({ admin }) => admin && styles.colorTableEdited};
    
    ${MapLayerTitleWrapper} {
        justify-content: center;
    }

    ${props => props.active && css`
        border-bottom: 5px solid;
    `}

    &:hover {
        background: unset;
    }
`;

export const ButtonIcon = styled(Icon)`
    display: flex;
    justify-content: flex-end;
    padding: 2px 4px 0 0;
    height: 45px;
    background: transparent;
    box-shadow: unset;
    color: #F1F1F1;

    ${props => props.active && css`
        border-bottom: 5px solid rgb(73,194,241);
    `}

    &:hover {
        cursor: pointer;
    }
`;
