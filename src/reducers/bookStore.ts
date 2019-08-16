import { UPDATE_STATE } from '../constants/bookStore'

const INITIAL_STATE = {
    bookList: []
}

export default function bookStore(state = INITIAL_STATE, action) {
    switch (action.type) {
        case UPDATE_STATE:
            return {
                ...state,
                bookList: action.payload
            }
        default:
            return state
    }
}
