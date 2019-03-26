import styled from 'styled-components';
import { colorMainLight, colorMain } from '../../../../ui/defaultStyles';

export const ColorRow = styled.div`
    display: flex;
    margin-bottom: 20px;
`;

export const Color = styled.div`
    background-color: ${props => props && props.color};
    height: 35px;
    width: 35px;
    margin: 10px;
    border: 5px solid ${props => (props.selected ? colorMain : '#fff')};
    cursor: pointer;

    @media (hover: hover) {
        &:hover {
            border-color: ${colorMainLight};
        }
    }
`;

export const ColorInput = styled.input`
    display: block;
    margin: 10px;
    background: #fff;
    border-width: 5px;
    border-style: solid;
    border-radius: 0;
    border-color: ${props => (props.selected ? colorMain : '#fff')};
    cursor: pointer;
    padding: 0;
    width: 35px;
    height: 35px;
    -webkit-appearance: none;

    &:focus {
        outline: none;
    }

    &::-webkit-color-swatch-wrapper {
        padding: 0;
    }

    &::-webkit-color-swatch {
        border: none;
    }

    &[type="text"] {
        display: none;
    }

    @media (hover: hover) {
        &:hover {
            border-color: ${colorMainLight};
        }
    }
`;
