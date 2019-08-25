import { UPDATE_STATE } from '../constants/bookCommments'
import request from '../utils/request';

export const updataState = (bookCommments) => {
    return {
        type: UPDATE_STATE,
        payload: bookCommments
    }
}

// 异步的action
export function queryBookCommments(params: any) {
    console.log(params)
    return dispatch => {
        request(`https://easy-mock.com/mock/5d4bee8bf2af1a3fa3b31cb7/wa-t/BookLendingMiniapp/getAllComments?id=${params}`)
            .then(res => {
                console.log('action触发了', res)
                const { success, data } = res.data;
                if (success) {
                    dispatch(updataState({ book: data.book, comments: data.comments, }))
                }
            }).catch(e => {
                console.log(e)
            });
    }
}
