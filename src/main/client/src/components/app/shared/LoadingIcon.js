// @flow
import React from 'react';
import { PulseLoader } from 'react-spinners';
import * as styles from '../../ui/defaultStyles';

type Props = {
    loading: boolean,
    size?: number,
};

function LoadingIcon({ loading, size }: Props) {
    return (
        <div className="loading-icon">
            <PulseLoader color={styles.colorMain} size={size} loading={loading} />
        </div>
    );
}

LoadingIcon.defaultProps = {
    size: 12,
};

export default LoadingIcon;
