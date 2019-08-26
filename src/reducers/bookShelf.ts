import { UPDATE_STATE } from '../constants/bookShelf'

const INITIAL_STATE = {
    shelfList: []
}

export default function bookShelf(state = INITIAL_STATE, action) {
    switch (action.type) {
        case UPDATE_STATE:
            return {
                ...state,
                shelfList: action.payload
            }
        default:
            return state
    }
}
