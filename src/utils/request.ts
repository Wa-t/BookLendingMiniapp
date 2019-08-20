import Taro from '@tarojs/taro'

export default function request(url: string, data?: any, method? : any) {
    return Taro.request({
        url,
        data: data ? data : {},
        method: method || 'GET',
        header: {
            'content-type': 'application/json'
        }
    })
}
