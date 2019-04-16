import styled from 'styled-components';
import { colorMainLight, colorTableEdited } from '../../../../ui/defaultStyles';

export const DropzoneContent = styled.div`
    text-align: center;
    padding-bottom: 3rem;
    border: 4px solid ${props => (props.isValidFile ? colorMainLight : colorTableEdited)};
`;
