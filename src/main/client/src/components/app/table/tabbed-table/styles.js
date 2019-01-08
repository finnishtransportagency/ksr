import styled, { css } from 'styled-components';
import { Button } from '../../../ui/elements';

export const WrapperTabbedTable = styled.div`
    width: 100%;
    height: 58px;
    position: absolute;
    top: 0;
    white-space: nowrap;
    overflow: hidden;
`;

export const ButtonTabbedTableTab = styled(Button)`
    width: 120px;
    text-overflow: ellipsis;
    overflow: hidden;
    margin: 0;
    border-bottom: 5px solid transparent;

    ${props => props.active && css`
        border-bottom: 5px solid;
    `}
`;
