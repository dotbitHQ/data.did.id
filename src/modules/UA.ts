export const DeviceType = {
  PC: 0,
  MOBILE: 1,
  TABLET: 2
}

/**
 * Client-side detection class
 *
 * This class needs to be initialized by calling the init method after obtaining the user agent before it can be used
 */
class UA {
  private deviceType: number

  constructor () {
    this.deviceType = DeviceType.PC
  }

  init (userAgent: string) {
    // console.debug('Init UA with user agent: ' + userAgent)

    if (userAgent.match(/Android|iPhone|Mobile|MQQBrowser/i)) {
      this.deviceType = DeviceType.MOBILE
    }
    else {
      this.deviceType = DeviceType.PC
    }
  }

  isMobile () {
    return this.deviceType === DeviceType.MOBILE
  }
}

const ua = new UA()
export { ua as default }
