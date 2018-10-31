import styled from 'styled-components';

import IconWrapper from './IconWrapper';
import Icon from './Icon';
import TextWrapper from './TextWrapper';
import Text from './Text';

const Contract = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 1rem 0;
`;

Contract.IconWrapper = IconWrapper;
Contract.IconWrapper.Icon = Icon;
Contract.TextWrapper = TextWrapper;
Contract.TextWrapper.Text = Text;

export default Contract;
