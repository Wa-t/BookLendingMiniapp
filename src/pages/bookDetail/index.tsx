import { ComponentClass, version } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtDivider, AtSegmentedControl } from 'taro-ui';
import { autobind } from 'core-decorators'
import { connect } from '@tarojs/redux'

import * as actionCreater from '../../actions/bookDetail'
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
  bookDetail: {

  }
}

type BookDetail = {
  id: string
  bookName: string
  author: string
  Translator?: string
  version: string
  bookImage: string
  type: string
  score: string
  introduction: string
  isBorrow: boolean
}

type BookRecord = {
  id: string,
  borrowDate: string,
  borrower: string,
}

type PageDispatchProps = {
  bookInfo: BookDetail
  bookRecord: [BookRecord]
  queryBookDetail: (any) => void
  queryRecord: (any) => void
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


@connect(({ bookDetail }) => ({
  ...bookDetail
}), actionCreater)
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
    navigationBarTitleText: '书籍详情'
  }

  constructor(props) {
    super(props)
    this.state = {
      current: 0,
    }
  }
  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }

  componentDidMount() {
    const { queryBookDetail, queryRecord } = this.props
    queryBookDetail({})
    queryRecord({})
  }
  componentWillUnmount() { }
  // 
  componentDidShow() { }

  componentDidHide() { }

  handleClose() {

  }

  handleSwitch(value) {
    this.setState({
      current: value
    })
    this.props.queryRecord({})
  }

  renderRecord() {
    const { bookRecord } = this.props;
    return bookRecord.map((item, i) => (
      <View className="at-row record" key={i}>
        <View className="at-col at-col-6">
          {item.borrower}
        </View>
        <View className="at-col at-col-6">
          {item.borrowDate}
        </View>
      </View>
    ))
  }
  render() {
    const { } = this.state
    const { bookInfo } = this.props;
    return (
      <View className='bookDetail'>
        <View className="at-row">
          <View className="at-col at-col-5 bookInfoLeft">
            <image
              style="width: 100px; height: 100px"
              src="https://ss3.baidu.com/9fo3dSag_xI4khGko9WTAnF6hhy/image/h%3D300/sign=0cc74ef9a3773912db268361c8188675/9922720e0cf3d7ca810f3732f81fbe096a63a9fd.jpg" />
          </View>
          <View className="at-col at-col-7 info">
            <View className="bookName">{bookInfo.bookName}</View>
            <View className="bookInfo">
              <View className="infoList">作者：{bookInfo.author}</View>
              {bookInfo.Translator ? <View className="infoList">译者：{bookInfo.Translator}</View> : null}

              <View className="infoList">分类：{bookInfo.type}</View>
              <View className="infoList">出版信息：{bookInfo.version}</View>
              <View >
                评分：{bookInfo.score}
              </View>
            </View>
          </View>
        </View>
        <AtDivider height="30" />
        <View>
          <View className="title">内容简介</View>
          <View className="introduction">
            {bookInfo.introduction}
          </View>
        </View>
        <AtDivider height="30" />
        <View>
          <View className="title">借阅记录</View>
          <AtSegmentedControl
            onClick={this.handleSwitch}
            selectedColor='#FF4949'
            fontSize='30'
            current={this.state.current}
            values={['近七天', '近一月', '近三月']}
          />
          <View style={{ marginTop: '10px', marginBottom: '120rpx' }}>
            {this.renderRecord()}
          </View>
        </View>
        <View className="fixedFooter">
          button
        </View>
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
