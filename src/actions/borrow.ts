import { UPDATE_STATE } from '../constants/borrow'
import request from '../utils/request';

export const updataState = (borrowList) => {
    return {
        type: UPDATE_STATE,
        payload: borrowList
    }
}

// 异步的action
export function queryBorrowList(params: any) {
    return dispatch => {
        request('https://easy-mock.com/mock/5d4bee8bf2af1a3fa3b31cb7/wa-t/BookLendingMiniapp/getBookList?mode=all', {
        }).then(res => {
            const { success, data } = res.data;
            if (success) {
                dispatch(updataState(data.list))
            }
        }).catch(e => {
            console.log(e)
        });
    }
}
