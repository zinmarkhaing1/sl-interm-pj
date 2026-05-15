import { ActionType } from "../action-type";
export const fetchNotes = (notes:any) => {
    return {
    type: ActionType.FETCH_NOTES,
    payload:notes
}

}

export const selectNotes = (note:any) => {
    return {
    type: ActionType.SELECT_NOTE,
    payload:note
}

}

export const removeselectNote = (note:any) => {
    return {
    type: ActionType.REMOVE_SELECT_NOTE,
    payload:note
}

}
