import { ActionType } from "../../action/action-type";
const initialState = {
    notes:[],
    note:{},
};

interface Action {
    type : string;
    payload?:any;
}

export const noteReducer = (state = initialState,action:Action)=>{

    switch (action.type) {
        case ActionType.FETCH_NOTES:
            return {...state,notes :action.payload};
        case ActionType.SELECT_NOTE:
            return {...state,note :action.payload};
        case ActionType.REMOVE_SELECT_NOTE:
            return {...state,note:{}};

        default: return state;
    }
};