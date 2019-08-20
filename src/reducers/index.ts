import { combineReducers } from 'redux'
import counter from './counter'
import bookStore from './bookStore'
import borrow from './borrow'
import bookComments from './bookComments'

export default combineReducers({
  counter,
  bookStore,
  borrow,
  bookComments,
})
