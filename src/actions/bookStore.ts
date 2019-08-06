import { UPDATE_STATE } from '../constants/bookStore'
import request from '../utils/request';

export const updataState = (bookList) => {
    return {
        type: UPDATE_STATE,
        payload: bookList
    }
}

// 异步的action
export function queryBookList(params: any) {
    return dispatch => {
        request('/api', { data: params })
            .then(res => {
                const { data, code } = res;
                if (code === '200') {
                    dispatch(updataState(data))
                }
            })
            .catch(e => {
                console.log(e)
            });
    }
}
