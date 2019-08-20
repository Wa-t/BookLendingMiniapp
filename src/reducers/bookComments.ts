import { UPDATE_STATE } from '../constants/bookCommments'

const INITIAL_STATE = {
    book:{},
    comments: []
}

export default function bookCommonents(state = INITIAL_STATE, action) {
    switch (action.type) {
        case UPDATE_STATE:
            return {
                ...state,
                ...action.payload
            }
        default:
            return state
    }
}
