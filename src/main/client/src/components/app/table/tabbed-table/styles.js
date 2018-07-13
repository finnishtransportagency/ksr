import styled, { css } from 'styled-components';
import { Button } from '../../../ui/elements';

export const WrapperTabbedTable = styled.div`
    width: 100%;
    height: 52px;
    position: absolute;
    top: 0;
    white-space: nowrap;
    overflow: hidden;
`;

export const ButtonTabbedTableTab = Button.extend`
    width: 120px;
    display: inline-block;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    margin: 0;
    box-sizing: border-box;

    ${props => props.active && css`
        border-bottom: 5px solid;
    `}
`;
