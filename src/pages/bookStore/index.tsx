import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { AtTabs, AtTabsPane, AtGrid } from 'taro-ui'
import { connect } from '@tarojs/redux'
import { autobind } from 'core-decorators'
import { updataState, queryBookList } from '../../actions/bookStore'

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

type Book = {
  image: string;
  value: string;
}

type PageStateProps = {
  bookStore: {
    bookList: Array<Book>;
  },
  dispatch
}

type PageDispatchProps = {
  // updataState: () => void
  // queryBookList: () => any
  // dispatch: ({ type: string, payload: any }) => PageStateProps
}

type PageOwnProps = {}

type PageState = {
  current: number
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Index {
  props: IProps;
  state: PageState;
}

@connect(({ bookStore }, dispatch) => ({
  bookStore,
  dispatch,
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
    navigationBarTitleText: '书库'
  }

  constructor(props) {
    super(props);
    this.state = {
      current: 0
    }
  }
  componentWillReceiveProps(nextProps) {
    // console.log(this.props, nextProps)
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(queryBookList({}))
  }
  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  handleClick(tabKey) {
    const { dispatch } = this.props;
    // console.log(this.props.dispatch)
    this.setState({
      current: tabKey,
    })
    dispatch(queryBookList({}))
  }

  renderBookList() {
    console.log('-----------')

    const { bookStore } = this.props
    const { bookList } = bookStore
    // const filterBookList =bookList.map()
    return (
      <AtGrid data={bookList} />
    )
  }

  render() {
    const tabList = [{ title: '综合' }, { title: '借阅最多' }, { title: '最新上架' }]
    return (
      <AtTabs current={this.state.current} tabList={tabList} onClick={this.handleClick}>
        <AtTabsPane current={this.state.current} index={0} >
          {
            this.renderBookList()
          }
        </AtTabsPane>
        <AtTabsPane current={this.state.current} index={1}>
          {
            this.renderBookList()
          }
        </AtTabsPane>
        <AtTabsPane current={this.state.current} index={2}>
          {
            this.renderBookList()
          }
        </AtTabsPane>
      </AtTabs >
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
