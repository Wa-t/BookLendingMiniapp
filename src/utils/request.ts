import Taro from '@tarojs/taro'

export default function request(url: string, data?: any) {
    return Taro.request({
        url,
        data: data ? data : {},
        header: {
            'content-type': 'application/json'
        }
    })
}
