import _ from 'lodash';



const codeMessage = {
    200: '服务器成功返回请求的数据。',
    201: '新建或修改数据成功。',
    202: '一个请求已经进入后台排队（异步任务）。',
    204: '删除数据成功。',
    400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
    401: '没有权限。',
    403: '访问是被禁止的。',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器或联系技术人员。',
    502: '网络中转错误，从上游服务器收到无效响应。',
    503: '服务不可用，服务器暂时过载或维护。',
    504: '服务超时。',
};

async function checkStatus(response, url) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }

    const errortext = codeMessage[response.status] || response.statusText;
    const error = new Error(errortext);
    error.name = response.status;
    throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [option]  The options we want to pass to "fetch"
 * @param  {string} [token]   Token will add to header param 'Authorization'.
 * @return {object}           An object or string
 */
export function fetchRequest(url, option) {
    const defaultOptions = {
        credentials: 'include',
    };
    const newOptions = { ...defaultOptions, ...option };
    if (
        newOptions.method.toUpperCase() === 'POST' ||
        newOptions.method.toUpperCase() === 'PUT' ||
        newOptions.method.toUpperCase() === 'DELETE'
    ) {
        if (!(newOptions.body instanceof FormData)) {
            newOptions.headers = {
                Accept: 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
                ...newOptions.headers,
            };
            // newOptions.body = JSON.parse(newOptions.body);
        } else {
            // newOptions.body is FormData
            newOptions.headers = {
                Accept: 'application/json',
                ...newOptions.headers,
            };
        }
    }


    return fetch(url, newOptions)
        .then(response => checkStatus(response, url))
        .then((response) => {
            // DELETE and 204 do not return data by default
            // using .json will report an error.
            if (newOptions.method === 'DELETE' || response.status === 204) {
                return response.text();
            }
            return response.json();
        })
        .catch((e) => {
            throw e;
        });
}

/**
 * Requests a URL, returning a response body.
 * Will refresh token when get 401.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [option] The options we want to pass to "fetch"
 * @return {object}           An object or string
 */
export default async function request(url, option) {
    const responseBody = await fetchRequest(url, option).catch(async (e) => {
        // 其他类型的异常暂不处理
        throw e;
    });
    return responseBody;
}
