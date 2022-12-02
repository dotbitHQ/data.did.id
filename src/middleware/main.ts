import ua from '~/modules/UA'
import { Context } from '@nuxt/types'
import { COMMON_KEYS } from '~/store/common'

export default ({ store, req }: Context) => {
  let userAgent
  if (process.client) {
    userAgent = navigator.userAgent || ''
  }
  else {
    userAgent = req.headers['user-agent'] || ''
  }

  ua.init(userAgent)

  if (process.client) {
    if (window.screen.availWidth < 960) {
      store.commit(COMMON_KEYS.setMobile, true)
    }
  }
  else {
    store.commit(COMMON_KEYS.setMobile, ua.isMobile())
  }
}
