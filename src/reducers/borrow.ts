import { UPDATE_STATE } from '../constants/borrow'

const INITIAL_STATE = {
    borrowList: [
        {
            id: '1',
            image: 'string',
            value: '霍乱时期的爱情',
            expireDate: '2019-09-01'
        },
        {
            id: '1',
            image: 'string',
            value: '平凡的世界',
            expireDate: '2019-09-01'
        }
    ]
}

export default function borrow(state = INITIAL_STATE, action) {
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
