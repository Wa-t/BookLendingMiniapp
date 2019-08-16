import { combineReducers } from 'redux'
import counter from './counter'
import bookStore from './bookStore'
import borrow from './borrow'

export default combineReducers({
  counter,
  bookStore,
  borrow
})
