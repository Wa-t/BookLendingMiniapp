import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtSwipeAction, AtList, AtListItem } from 'taro-ui'
import { connect } from '@tarojs/redux'
import { autobind } from 'core-decorators'
import { updataState, queryBorrowList } from '../../actions/borrow'

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
  bookId: string
  bookName: string
  shouldReturnDate: string
  borrowDate: string
}

type PageStateProps = {
  borrow: {
    borrowList: Array<Book>;
  },
  dispatch: (arg: any) => any
}

type PageDispatchProps = {

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

@connect(({ borrow }, dispatch) => ({
  borrow,
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
    navigationBarTitleText: '我的借阅'
  }

  constructor(props) {
    super(props);
    this.state = {
      current: 0
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(queryBorrowList({}))
  }
  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  handleClick(tabKey) {
    const { dispatch } = this.props;
    this.setState({
      current: tabKey,
    })
    // dispatch(queryBookList({}))
  }

  handleSingle(index) {

  }

  render() {
    const swipeOperation = [
      {
        text: '取消',
        style: {
          backgroundColor: '#6190E8'
        }
      },
      {
        text: '还书',
        style: {
          backgroundColor: '#FF4949'
        }
      }
    ]
    const { borrowList } = this.props.borrow;
    return (
      <View>
        <View className='at-row at-row__justify--center' style={{ lineHeight: '100rpx', height: '100rpx' }}>
          <View className='at-col at-col-5' style={{ textAlign: 'center' }}>书籍名称</View>
          <View className='at-col at-col-5' style={{ textAlign: 'center' }}>应还日期</View>
        </View>
        <AtList>
          {borrowList.map((item, index) => (
            <AtSwipeAction
              key={index}
              onOpened={() => this.handleSingle(index)}
              // isOpened={item.isOpened}
              options={swipeOperation}
            >
              <AtListItem title={item.bookName} extraText={item.shouldReturnDate} />
            </AtSwipeAction>
          ))}
        </AtList>
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
