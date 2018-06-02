import { combineReducers } from 'redux';
import { DO_LOGIN, FETCH_TASKS } from './FormConstants';

const loginReducer = function(state = null, action) {
    switch (action.type) {
        case DO_LOGIN:
            return action.payload || false;

        default:
            return state;
    }
};

const tasksReducer = function(state = null, action) {
    switch (action.type) {
        case FETCH_TASKS:
            return action.payload || false;

        default:
            return state;
    }
};

export default combineReducers({
    auth: loginReducer,
    tasks: tasksReducer
});
