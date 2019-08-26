import { UPDATE_STATE } from '../constants/bookShelf'
import request from '../utils/request';

export const updataState = (shelfList) => {
    return {
        type: UPDATE_STATE,
        payload: shelfList
    }
}

// 异步的action
export function queryShelfList(params: any) {
    return (dispatch) => {
        request('https://easy-mock.com/mock/5d4bee8bf2af1a3fa3b31cb7/wa-t/BookLendingMiniapp/queryMyShelf', {
        }).then(res => {
            const { success, data } = res.data;
            if (success) {
                dispatch(updataState(data.dataList))
            }
        }).catch(e => {
            console.log(e)
        });
    }
}
