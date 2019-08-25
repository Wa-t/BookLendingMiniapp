import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtCard, AtSearchBar } from 'taro-ui'
import { autobind } from 'core-decorators'
import { connect } from '@tarojs/redux'
import { queryBookCommments } from '../../../src/actions/bookComments'
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
type IBook = {
  src: string,
  name: string,
}
type IApply = {
  id: string,
  icon: string,
  name: string,
  time: string,
  zan: number,
  content: string,
}
type IComment = IApply & {
  apply?: Array<IApply>
}

type PageStateProps = {
  book: IBook,
  comments: Array<IComment>,
}


type PageDispatchProps = {
  add: () => void
  dec: () => void
  asyncAdd: () => any
  dispatch: (any) => void
}

type PageOwnProps = {
}

type PageState = {
  value: string,
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Index {
  props: IProps;
  state: PageState;
}


@connect(({ bookComments }) => bookComments)
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
    navigationBarTitleText: '个人中心'
  }

  constructor(props) {
    super(props)
    this.state = {
      value: '',
    }
  }
  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }

  componentDidMount() {
    const { id } = this.$router.params
    const { dispatch } = this.props;
    if (id) {
      dispatch(queryBookCommments(id))
    }
    // const _this = this
    // Taro.getSetting({
    //   success(res) {
    //     console.log(res.authSetting['scope.userInfo'])
    //     if (res.authSetting['scope.userInfo']) {
    //       Taro.getUserInfo({
    //         success: function (res) {
    //           console.log(res)
    //           const userInfo = JSON.parse(res.rawData)
    //           console.log(userInfo)
    //           _this.setState({
    //             userInfo,
    //           })
    //         }
    //       })
    //     } else {
    //       _this.setState({ isOpened: true })
    //       Taro.authorize({
    //         scope: 'scope.userInfo',
    //       }).then(res => {
    //         console.log(res, 'authorize')
    //       }).catch(e => {
    //         console.log(e, 'authorize')
    //       })
    //     }
    //   }
    // })
  }
  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  onChange(e: string) {
    this.setState({ value: e })
  }
  onActionClick() {

  }

  render() {
    const { value } = this.state
    const { book, comments } = this.props
    console.log(comments)
    return (
      <View className='bookComment'>
        <View className="at-row bookComment-top">
          <View className='at-col at-col-6'>
            <Image src={book.src} />
          </View>
          <View className='at-col at-col-6 book-name'>
            <Text>{book.name}</Text>
          </View>
        </View>
        <View className="bookComment-body">
          {comments.map((item: IComment) => (
            <AtCard
              note={`赞 ${item.zan}`}
              extra={item.time}
              title={item.name}
              thumb={item.icon || 'http://www.logoquan.com/upload/list/20180421/logoquan15259400209.PNG'}
            >
              <Text>{item.content}</Text>
            </AtCard>
          ))}
        </View>
        <View className="bookComment-bottom">
          <AtSearchBar
            showActionButton
            placeholder="看了这么多可能你也有话想说"
            actionName="评论"
            value={value}
            onChange={this.onChange}
            onActionClick={this.onActionClick}
          />
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
