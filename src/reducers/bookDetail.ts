import { UPDATE_STATE, QUERY_DETAIL, QUERY_RECORD } from '../constants/bookDetail'

const INITIAL_STATE = {
    bookInfo: {},
    bookRecord: [],
}

export default function bookDetail(state = INITIAL_STATE, action) {
    switch (action.type) {
        case UPDATE_STATE:
            return {
                ...state,
                ...action.paylaod,
            }
        case QUERY_DETAIL:
            return {
                ...state,
                bookInfo: {...action.payload},
            }
        case QUERY_RECORD:
            return {
                ...state,
                bookRecord: [...action.payload],
                }
        default:
            return state
    }
}
