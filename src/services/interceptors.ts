import { Context } from '@nuxt/types'
import { AxiosError, AxiosResponse } from 'axios'
import errno from '~/constant/errno'

let upgradeNotified = false

export function onFulfilled (context: Context) {
  return (res: AxiosResponse) => {
    if (res.data) {
      if (res.data.err_no === errno.success) {
        return res.data.data
      }
      else {
        if (res.data.err_no === errno.apiErrorCodeSystemUpgrade) {
          if (!upgradeNotified) {
            context.app.$alert({
              title: context.app.$tt('Tips'),
              message: context.app.$tt('upgrade notice')
            })
          }
          upgradeNotified = true
        }
        else {
          const serverError: any = new Error(res.data.err_msg)
          serverError.code = res.data.err_no
          throw serverError
        }
      }
    }
    else {
      const serverError: any = new Error(res.statusText)
      serverError.code = res.status
      throw serverError
    }
  }
}

export function onRejected (err: AxiosError) {
  const code = err?.response?.status || errno.networkError
  err.code = String(code)
  err.message = err?.response?.statusText || err.message
  throw err
}
