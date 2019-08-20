import { UPDATE_STATE } from '../constants/borrow'

const INITIAL_STATE = {
    borrowList: []
}

export default function borrow(state = INITIAL_STATE, action) {
    console.warn(action)
    console.warn(state)
    switch (action.type) {
        case UPDATE_STATE:
            return {
                ...state,
                borrowList: action.payload
            }
        default:
            return state
    }
}
