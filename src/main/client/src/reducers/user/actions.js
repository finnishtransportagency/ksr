// @flow
import { fetchGetUserInfo } from '../../api/user/currentUser';
import * as types from '../../constants/actionTypes';

export const setUserInfo = () => (dispatch: Function) => {
    fetchGetUserInfo()
        .then((user) => {
            if (user) {
                dispatch({
                    type: types.SET_USER_INFO,
                    authorities: user.authorities,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    mobile: user.mobile,
                    organization: user.organization,
                    username: user.username,
                });
            }
        });
};
