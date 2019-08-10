import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtTabBar, AtSearchBar, AtButton  } from 'taro-ui'
import { connect } from '@tarojs/redux'
import { autobind } from 'core-decorators'
import request from '../../utils/request';


import Personal from '../personal'
import BookStore from '../bookStore'

import { add, minus, asyncAdd } from '../../actions/counter'

import './index.less'

// #region 书写注意
//
// 目前 typescript 版本还无法在装饰器模式下将 Props 注入到 Taro.Component 中的 props 属性
// 需要显示声明 connect 的参数类型并通过 interface 的方式指定 Taro.Component 子类的 props
// 这样才能完成类型检查和 IDE 的自动提示
// 使用函数模式则无此限制
// ref: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20796
//
// #endregion


type PageStateProps = {
  counter: {
    num: number
  }
}

type PageDispatchProps = {
  add: () => void
  dec: () => void
  asyncAdd: () => any
  dispatch: () => void
}

type PageOwnProps = {}

type PageState = {
  current: number;
  searchValue: string, // 搜索输入框value
  cameraCode: string, // 扫描结果
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Index {
  props: IProps;
  state: PageState;
}
interface ScanCode extends Taro.scanCode.Param {
  success: Function,
}

@connect(({ counter }) => ({
  counter
}), (dispatch) => ({
  add() {
    dispatch(add())
  },
  dec() {
    dispatch(minus())
  },
  asyncAdd() {
    dispatch(asyncAdd())
  }
}))
@autobind
class Index extends Component {

  /**
 * 指定config的类型声明为: Taro.Config
 *
 * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
 * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
 * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
 */
  config: Config = {
    navigationBarTitleText: '首页'
  }
  param: ScanCode = {
    success (params: any) {
      // params.result 打印扫码结果
      request('https://easy-mock.com/mock/5d4bee8bf2af1a3fa3b31cb7/wa-t/BookLendingMiniapp/getBookList?mode=all', {scanCode: params.result})
        .then((res: any) => console.log(res))
    }
  }
  constructor(props: IProps) {
    super(props);
    this.state = {
      current: 0,
      searchValue: '', // 搜索输入框value
      cameraCode: '', // 扫描结果
    }
  }
  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }
  shouldComponentUpdate(nextProps: IProps, nextState: PageState) {
    if (JSON.stringify(this.props) !== JSON.stringify(nextProps) || JSON.stringify(this.state) !== JSON.stringify(nextState)) {
      return true
    }
    return false
  }
  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  handleClick(value) {
    this.setState({ current: value })
  }
  handleSearchChange(value: string) {
    this.setState({ searchValue: value })
  }
  handleScanCode() {
    Taro.scanCode(this.param)
  }
  handleSearch() {
    const { dispatch } = this.props;
    dispatch();
  }
  renderIndex () {
    const { searchValue } = this.state
    return (
    <View>
      <AtSearchBar
        className="search"
        showActionButton
        value={searchValue}
        placeholder="请输入书名/作者"
        onChange={this.handleSearchChange}
        onActionClick={this.handleSearch}
      />
      <View className="scan-icon" />
      <AtButton className='scanCode-btn' circle={true} onClick={this.handleScanCode}>扫码借书</AtButton>
    </View>)
  }
  
  renderView() {
    const { current } = this.state;
    let view: any = null;
    switch (current) {
      case 0: {
        view = <BookStore />;
        break;
      }
      case 1: {
        view = this.renderIndex();
        break;
      }
      case 2: {
        view = <Personal />;
        break;
      }
    }
 
    return view;
  }
  render() {
    console.log('render')
    return (
      <View className='index'>
        {this.renderView()}
        <AtTabBar
          fixed
          tabList={[
            { title: '书库', iconType: 'list' },
            { title: '借阅', iconType: 'bookmark' },
            { title: '我的', iconType: 'user' }
          ]}
          onClick={this.handleClick}
          current={this.state.current}
        />
      </View>
    )
  }
}

// #region 导出注意
//
// 经过上面的声明后需要将导出的 Taro.Component 子类修改为子类本身的 props 属性
// 这样在使用这个子类时 Ts 才不会提示缺少 JSX 类型参数错误
//
// #endregion

export default Index as ComponentClass<PageOwnProps, PageState>
