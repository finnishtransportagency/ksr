import styled, { css } from 'styled-components';
import { Button } from '../../../ui/elements';

export const WrapperTabbedTable = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
`;

export const ButtonTabbedTableTab = Button.extend`
    width: 120px;
    border-bottom: 5px solid rgba(0, 0, 0, 0.1);
    border-right: 2px solid rgba(0, 0, 0, 0.1);
    display: inline-block;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;

    ${props => props.active && css`
        border-bottom: 5px solid;
    `}
`;
