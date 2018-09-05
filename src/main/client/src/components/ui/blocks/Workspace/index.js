import styled from 'styled-components';

import Icon from './Icon';
import TextColumn from './TextColumn';
import Text from './Text';
import * as styles from '../../defaultStyles';

const Workspace = styled.div`
    background: ${styles.colorBackgroundLight};
    color: ${styles.colorFontDark};
    margin: 1em 0;
    display: flex;
    flex-direction: row;
    width: 100%;
    user-select: none;
    white-space: nowrap;
`;

Workspace.Icon = Icon;
Workspace.TextColumn = TextColumn;
Workspace.Text = Text;

export default Workspace;
