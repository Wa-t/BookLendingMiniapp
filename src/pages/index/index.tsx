import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtTabBar } from 'taro-ui'
import { connect } from '@tarojs/redux'
import { autobind } from 'core-decorators'

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
}

type PageOwnProps = {}

type PageState = {
  current: number;
  // views: any
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Index {
  props: IProps;
  state: PageState;
}

// const pageList =  [
//   {
//     id: 0,
//     page: <BookStore/>,
//     navigatorText: '书库'
//   },
//   {
//     id: 1,
//     page: this.renderIndex(),
//     navigatorText: 'fasd'
//   },
//   {
//     id: 0,
//     page: <Personal/>,
//     navigatorText: 'fasd'
//   }
// ]
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

  constructor(props: IProps) {
    super(props);
    this.state = {
      current: 0,
    }
  }
  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  handleClick(value) {
    this.setState({
      current: value
    })
  }
  renderIndex () {
    return (
    <View>
      hello world
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
        {
          this.renderView()
        }
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
