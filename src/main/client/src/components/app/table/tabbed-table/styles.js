import styled, { css } from 'styled-components';
import { Button } from '../../../ui/elements';
import { MapLayerTitleWrapper } from '../../shared/styles';

export const WrapperTabbedTable = styled.div`
    width: calc(100% - 60px);
    height: 58px;
    position: absolute;
    top: 0;
    white-space: nowrap;
    overflow: hidden;
    
    @media only screen and (max-width: 768px) {
        width: 100%;
    }
`;

export const ButtonTabbedTableTab = styled(Button)`
    width: 120px;
    text-overflow: ellipsis;
    overflow: hidden;
    margin: 0;
    border-bottom: 5px solid transparent;
    height: 52px;
    
    ${MapLayerTitleWrapper} {
        justify-content: center;
    }

    ${props => props.active && css`
        border-bottom: 5px solid;
    `}
`;
