import { QUERY_DETAIL,QUERY_RECORD, UPDATE_STATE } from '../constants/bookDetail'
import request from '../utils/request';


export const queryBookDetail = (data = {}) => {
  return dispatch => {
    request(
      'https://easy-mock.com/mock/5d4bee8bf2af1a3fa3b31cb7/wa-t/BookLendingMiniapp/queryBookDetail', 
      {...data},
      'POST'
    ).then(res => {
        const { success, data } = res.data;
        if (success) {
            dispatch({
              type: QUERY_DETAIL,
              payload: data.bookInfo || {},
            })
        }
    }).catch(e => {
        console.log(e)
    });
}
}
export const queryRecord = (data = {}) => {
  return dispatch => {
    request('https://easy-mock.com/mock/5d4bee8bf2af1a3fa3b31cb7/wa-t/BookLendingMiniapp/queryBorrowRecord',
    {...data},
    'POST'
    ).then(res => {
        const { success, data } = res.data;
        if (success) {
            dispatch({
              type: QUERY_RECORD,
              payload: data.dataList || [],
            })
        }
    }).catch(e => {
        console.log(e)
    });
}
}

export const updataState = (data={}) => {
  return {
    type: UPDATE_STATE,
    data,
  }
}
