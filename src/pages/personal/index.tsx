import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtAvatar, AtList, AtListItem, AtFloatLayout } from 'taro-ui';
import { autobind } from 'core-decorators'
import { connect } from '@tarojs/redux'

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
  personal: {

  }
}

type UserInfo = {
  avatarUrl?: string
  city?: string
  country?: string
  gender?: number
  language?: string
  nickName?: string
  province?: string
}

type PageDispatchProps = {
  add: () => void
  dec: () => void
  asyncAdd: () => any
}

type PageOwnProps = {}

type PageState = {
  isOpened: boolean
  userInfo: UserInfo,
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Index {
  props: IProps;
  state: PageState;
}


@connect(({ personal }) => ({
  personal
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
    navigationBarTitleText: '个人中心'
  }

  constructor(props) {
    super(props)
    this.state = {
      isOpened: false,
      userInfo: {}
    }
  }
  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps)
  }

  componentDidMount() {
    const _this = this
    Taro.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          Taro.getUserInfo({
            success: function (res) {
              const userInfo = JSON.parse(res.rawData)
              _this.setState({
                userInfo,
              })
            }
          })
        } else {
          _this.setState({ isOpened: true })
          Taro.authorize({
            scope: 'scope.userInfo',
          }).then(res => {
            console.log(res, 'authorize')
          }).catch(e => {
            console.log(e, 'authorize')
          })
        }
      }
    })
  }
  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  handleClose() {

  }
  onOpenBorrow() {
    Taro.navigateTo({
      url: '/pages/borrow/index'
    })
  }

  render() {
    const { isOpened, userInfo } = this.state
    return (
      <View className='personal'>
        <View className="info">
          <View className="avatar">
            <AtAvatar customStyle={{ display: 'inline-block' }} image={userInfo.avatarUrl} circle size="large" />
          </View>
          <Text className="name">{userInfo.nickName}</Text>
        </View>
        <AtList>
          <AtListItem
            title='我的借阅'
            arrow='right'
            iconInfo={{
              size: 20,
              color: '#F05359',
              value: 'folder',
            }}
            onClick={this.onOpenBorrow}
          />
          <AtListItem
            title='我的上架'
            arrow='right'
            iconInfo={{
              size: 20,
              color: '#F05359',
              value: 'menu',
            }}
          />
          <AtListItem
            title='账号设置'
            arrow='right'
            iconInfo={{
              size: 20,
              color: '#F05359',
              value: 'settings',
            }}
          />
          <AtListItem
            title='退出登录'
            // note='描述信息'
            arrow='right'
            iconInfo={{
              size: 20,
              color: '#F05359',
              value: 'arrow-right',
            }}
          />
        </AtList>
        <AtFloatLayout isOpened={isOpened} onClose={this.handleClose}>
          <button open-type='getUserInfo' >获取授权</button>
        </AtFloatLayout>
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
