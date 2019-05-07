// @flow
import { SET_USER_INFO } from '../../constants/actionTypes';

type State = {
    type: string,
    authorities: Object[],
    email: string,
    firstName: string,
    lastName: string,
    mobile: string,
    organization: string,
    username: string,
};

type Action = {
    type: string,
    authorities: Object[],
    email: string,
    firstName: string,
    lastName: string,
    mobile: string,
    organization: string,
    username: string,
};

const initialState = {
    type: '',
    authorities: [],
    email: '',
    firstName: '',
    lastName: '',
    mobile: '',
    organization: '',
    username: '',
};

export default (state: State = initialState, action: Action) => {
    switch (action.type) {
        case SET_USER_INFO:
            return {
                authorities: action.authorities,
                email: action.email,
                firstName: action.firstName,
                lastName: action.lastName,
                mobile: action.mobile,
                organization: action.organization,
                username: action.username,
            };
        default:
            return state;
    }
};
