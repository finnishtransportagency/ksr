// @flow
import React from 'react';
import { PulseLoader } from 'react-spinners';
import * as styles from '../../ui/defaultStyles';

type Props = {
    loading: boolean,
    size?: number,
};

const LoadingIcon = ({ loading, size }: Props) => (
    <div className="loading-icon">
        <PulseLoader color={styles.colorMain} size={size} loading={loading} />
    </div>
);

LoadingIcon.defaultProps = {
    size: 12,
};

export default LoadingIcon;
