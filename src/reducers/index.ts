import { combineReducers } from 'redux'
import counter from './counter'
import bookStore from './bookStore'

export default combineReducers({
  counter,
  bookStore
})
