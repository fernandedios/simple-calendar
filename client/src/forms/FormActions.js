import axios from 'axios';

import { DO_LOGIN, FETCH_TASKS } from './FormConstants';

export const doLogin = ({ email, password }) => async dispatch => {
    const res = await axios.post(`${process.env.REACT_APP_SERVER}/api/login`, { email, password });
    dispatch({ type: DO_LOGIN, payload: { ...res.data }});
};

export const doLogout = () => {
    return (dispatch) => {
        dispatch({ type: DO_LOGIN, payload: false });
    };
};

export const fetchTasks = (token) => async dispatch => {
    const headers = { 'Authorization': token };
    const res = await axios.get(`${process.env.REACT_APP_SERVER}/api/tasks`, { headers });
    dispatch({ type: FETCH_TASKS, payload: { ...res.data }});
};
