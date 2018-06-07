// @flow
import React from 'react';
import { PulseLoader } from 'react-spinners';
import * as styles from '../../ui/defaultStyles';

type Props = {
    loading: boolean,
};

const LoadingIcon = ({ loading }: Props) => (
    <div className="loading-icon">
        <PulseLoader color={styles.colorMain} loading={loading} />
    </div>
);

export default LoadingIcon;
