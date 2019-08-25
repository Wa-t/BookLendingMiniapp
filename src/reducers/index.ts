import { combineReducers } from 'redux'
import counter from './counter'
import bookStore from './bookStore'
import borrow from './borrow'
import bookDetail from './bookDetail'
import bookComments from './bookComments'
import bookShelf from './bookShelf'


export default combineReducers({
  counter,
  bookStore,
  borrow,
  bookDetail,
  bookComments,
  bookShelf,
})
