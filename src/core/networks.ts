
type HTTPMethod = `POST` | `GET` | `PUT` | `DELETE`

export type Resp<T> = {
  ok: boolean,
  error?: string,
  data: T,
}

type IReqParamQuery = {
  [key: string]: string | number
}

type IReqParamBody = any

interface IReqParam {
  query?: IReqParamQuery
  body?: IReqParamBody
}

const makeQueryStr = (url: string, query: IReqParamQuery) => {
  let paramStrings = []
  for (const p of Object.keys(query)) {
    const pv = query[p]
    if (pv !== "" && pv !== undefined && pv !== null) {
      paramStrings.push(`${p}=${pv}`)
    }
  }

  if (paramStrings.length > 0) {
    url += `?${paramStrings[0]}`

    for (let i = 1; i < paramStrings.length; i++) {
      url += `&${paramStrings[i]}`
    }
  }
  return url
}

export type RequestOption = {
  headers?: { [key: string]: string }
}

const doFetch = async (method: HTTPMethod, url: string, param: IReqParam, option: RequestOption): Promise<Response> => {
  // compose url
  url = param.query ? makeQueryStr(url, param.query) : url
  // compose body
  const data = param.body ? JSON.stringify(param.body) : undefined
  // 仅当网络故障时或请求被阻止时，才会标记为 reject。
  const res = await fetch(url, {
    method: method,
    body: data,
    headers: {
      'content-type': 'application/json',
      'user-agent': 'Mozilla/4.0 MDN Example',
      'Accept': 'application/json',
      ...option.headers
    },
    mode: 'cors',
    credentials: "include",
    redirect: 'follow'
  })
  return res
}

const doFetchJ = async <T>(method: HTTPMethod, url: string, param: IReqParam, option: RequestOption): Promise<Resp<T>> => {
  let res;
  try {
    res = await doFetch(method, url, param, option)
    if (!res.ok) {
      return { ok: false, error: res.statusText, data: undefined as any }
    }
  } catch (e) {
    return { ok: false, error: `network error? ${e}`, data: undefined as any }
  }

  try {
    const j = await res.json()
    return { ok: true, data: j };
  } catch (e) {
    return { ok: false, error: `json parse error. ${e}`, data: undefined as any }
  }
}

export const GetJ = async<T>(url: string, param: IReqParam, option: RequestOption = {}): Promise<Resp<T>> => {
  return await doFetchJ(`GET`, url, param, option);
}

export const PostJ = async<T>(url: string, param: IReqParam, option: RequestOption = {}): Promise<Resp<T>> => {
  return await doFetchJ(`POST`, url, param, option);
}

export const PutJ = async<T>(url: string, param: IReqParam, option: RequestOption = {}): Promise<Resp<T>> => {
  return await doFetchJ(`PUT`, url, param, option);
}

export const DeleteJ = async<T>(url: string, param: IReqParam, option: RequestOption = {}): Promise<Resp<T>> => {
  return await doFetchJ(`DELETE`, url, param, option);
}