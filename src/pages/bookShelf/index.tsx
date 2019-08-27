import { ComponentClass } from 'react'
import Taro, { Component, Config, showModal, showTabBar, showToast } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtRadio, AtButton, AtModal, AtModalHeader, AtModalContent, AtModalAction, AtToast } from 'taro-ui'
import { connect } from '@tarojs/redux'
import { autobind } from 'core-decorators'
import { queryShelfList } from '../../actions/bookShelf';
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

type BookItem = {
  bookId?: string
  bookName?: string
  canLowershelf?: boolean
  shelfDate?: string
}

type PageStateProps = {
  shelfList: Array<BookItem> | [];
}

type PageDispatchProps = {
  dispatch: (any) => any
}

type PageOwnProps = {}

type PageState = {
  value: string
  showModal: boolean
  showToast: boolean
  toastText: string
  toastStatus: "loading" | "error" | "success" | undefined
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Index {
  props: IProps;
  state: PageState;
}

@connect(({ bookShelf }) => ({
  ...bookShelf,
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
    navigationBarTitleText: '我的上架'
  }

  constructor(props) {
    super(props);
    this.state = {
      value: '',
      showModal: false,
      showToast: false,
      toastText: '',
      toastStatus: 'loading',
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(queryShelfList({}))
  }
  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  onUpload() {

  }

  onShowToast(text = "", status = '', duration = 0) {
    this.setState({
      toastStatus: status || 'loading',
      toastText: text || '',
      showToast: true,
    })
    duration && setTimeout(() => {
      this.onHideToast()
    }, duration)
  }

  onHideToast() {
    this.setState({
      showToast: false,
      toastStatus: '',
      toastText: '',
      duration: 0
    })
  }

  onLower() {
    this.setState({
      showModal: true,
    })
  }

  onCancel() {
    this.setState({
      showModal: false
    })
  }
  onConfirm() {
    this.setState({
      showModal: false
    })
  }
  handleChange(value) {
    this.setState({
      value
    })
  }


  renderList() {
    const { shelfList = [] } = this.props;
    const { value } = this.state;
    const options = shelfList.map(item => ({
      label: item.bookName,
      value: item.bookId,
      disabled: !item.canLowershelf
    }))
    return <AtRadio
      options={options}
      value={value}
      onClick={this.handleChange}
    />
  }


  render() {
    const { value } = this.state;
    const { shelfList } = this.props;
    const selectedBook: BookItem = shelfList.find(item => item.bookId === value) || {}
    console.log(selectedBook)
    return (
      <View className="bookShelf">
        {this.renderList()}
        <View className="fixedFooter at-row">
          <View className="at-col at-col-6">
            <AtButton type="secondary" onClick={this.onUpload} className="footerButton">上传书籍</AtButton>
          </View>
          <View className="at-col at-col-6">
            <AtButton type="primary" className="footerButton" disabled={!value} onClick={this.onLower}>下架书籍</AtButton>
          </View>
          <AtModal isOpened={this.state.showModal}>
            <AtModalHeader>确认下架本书籍吗</AtModalHeader>
            <AtModalContent>
              <View className="modalContent">书籍名称：{selectedBook.bookName}</View>
              <View className="modalContent" >上架时间：{selectedBook.shelfDate}</View>
            </AtModalContent>
            <AtModalAction>
              <button><View onClick={this.onCancel}>取消</View></button>
              <button><View onClick={this.onConfirm}>确定</View></button>
            </AtModalAction>
          </AtModal>
          <AtToast isOpened={this.state.showToast} duration={0} text={this.state.toastText} status={this.state.toastStatus}></AtToast>
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
