import { extend, setInteractionMode } from 'vee-validate'
import { max, min_value, max_value, required, integer } from 'vee-validate/dist/rules'
import { formatsByName } from '@ensdomains/address-encoder'
import { BSC, CKB, ETH, Polygon } from '~/constant/chain'
import { isValidAdaAddress } from '~/modules/ADAValidator'
import { $tt } from '~/plugins/i18n'
import { thousandSplit, findParsingRecordChain, isDomainHost } from '~/modules/tools'
import config from '~~/config'
import { ParsingRecordProfileKey } from '~/services/Account'
import { ParsingRecordDwebKey, TwitterUserUrlRegExp } from '~/constant'
import Web3Utils from 'web3-utils'
import CID from 'cids'

setInteractionMode('lazy')

export default () => {
  // field required
  extend('required', {
    ...required,
    message: (fieldName): string => {
      return $tt('Invalid {fieldName}', { fieldName })
    }
  })

  // select required
  extend('selectRequired', {
    ...required,
    message: (fieldName): string => {
      return $tt('Please select {fieldName}', { fieldName })
    }
  })

  // maximum string length
  extend('max', {
    ...max,
    message: (fieldName, args: any): string => {
      return $tt('{fieldName} must not exceed {length} characters', {
        fieldName,
        length: args.length
      })
    }
  })

  // 最小金额
  extend('minAmount', {
    ...min_value,
    params: ['min', 'unit'],
    message: (fieldName, args: any): string => {
      return $tt('{fieldName} must be greater than or equal to {min} {unit}', {
        fieldName,
        min: thousandSplit(args.min),
        unit: args.unit,
      })
    }
  })

  // 最大金额
  extend('maxAmount', {
    ...max_value,
    params: ['max', 'unit'],
    message: (fieldName, args: any): string => {
      return $tt('{fieldName} must be less than or equal to {max} {unit}', {
        fieldName,
        max: thousandSplit(args.max),
        unit: args.unit
      })
    }
  })

  // insufficient balance
  extend('insufficientBalance', {
    ...max_value,
    message: (): string => {
      return $tt('Insufficient balance')
    }
  })

  // positive integers
  extend('positiveIntegers', {
    validate (value: string) {
      return parseInt(value) === Number(value) && Number(value) > 0
    },
    message: (fieldName): string => {
      return $tt('{fieldName} must be a positive integer', { fieldName })
    }
  })

  // check address format
  extend('address', {
    params: ['key'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    message: (fieldName, args: any): string => {
      const chain = findParsingRecordChain(args.key)
      return $tt('{chain} address format is wrong', { chain: chain.text })
    },
    validate (value: string, args: any): boolean {
      try {
        const chain = findParsingRecordChain(args.key)
        let symbol = chain.text
        if ([BSC.symbol, 'HT', Polygon.symbol].includes(symbol)) {
          symbol = ETH.symbol
        }
        if (symbol === 'EOS') {
          return /^[1-5a-z.]{0,11}[1-5a-z]$/.test(value)
        }
        if (symbol === 'ADA') {
          return isValidAdaAddress(value)
        }
        if (symbol === CKB.symbol) {
          if (config.isProdData) {
            return /^ckb1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{42,}$/i.test(value)
          }
          else {
            return /^ckt1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{42,}$/i.test(value)
          }
        }

        if (symbol === ETH.symbol) {
          return /^0x[0-9a-f]{40}$/i.test(value) && Web3Utils.isAddress(value)
        }
        if (!formatsByName[symbol]) {
          return true
        }
        formatsByName[symbol].decoder(value)
        return true
      }
      catch (err) {
        console.error(err)
        return false
      }
    }
  })

  // object key
  extend('objectkey', {
    validate (value: string) {
      return /^[a-z0-9_]+$/g.test(value)
    },
    message: (fieldName): string => {
      return $tt('{fieldName} can only contain lowercase letters, numbers and underscores', { fieldName })
    }
  })

  // profile value
  extend('profileValue', {
    params: ['key'],
    validate (value: string, args: any) {
      const key = args.key
      switch (key) {
        case ParsingRecordProfileKey.twitter:
          return /^[a-zA-Z0-9_]+$/g.test(value) || TwitterUserUrlRegExp.test(value)
        case ParsingRecordProfileKey.nextid:
          return /^0x[A-Fa-f0-9]*:(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/.test(value)
        default:
          return true
      }
    },
    message: (fieldName): string => {
      return $tt('{fieldName} can only contain letters, numbers and underscores', { fieldName })
    }
  })

  // DWeb value
  extend('dwebValue', {
    params: ['key'],
    validate (value: string, args: any) {
      const key = args.key
      switch (key) {
        case ParsingRecordDwebKey.ipfs:
          try {
            const cid = new CID(value.replace(/ipfs:\/\//i, ''))
            if ((cid.codec === 'dag-pb' && cid.multibaseName === 'base58btc' && cid.version === 0) || (cid.codec === 'dag-pb' && cid.multibaseName === 'base32' && cid.version === 1)) {
              return true
            }
            else {
              return false
            }
          }
          catch (err) {
            console.log(err)
            return false
          }
        case ParsingRecordDwebKey.ipns:
          if (isDomainHost(value)) {
            return true
          }
          try {
            const cid = new CID(value.replace(/ipns:\/\//i, ''))
            if ((cid.codec === 'libp2p-key' && cid.multibaseName === 'base36' && cid.version === 1) || (cid.codec === 'libp2p-key' && cid.multibaseName === 'base32' && cid.version === 1)) {
              return true
            }
            else {
              return false
            }
          }
          catch (err) {
            console.log(err)
            return false
          }
        default:
          return true
      }
    },
    message: (fieldName, params): string => {
      const key = params.key
      switch (key) {
        case ParsingRecordDwebKey.ipfs:
        case ParsingRecordDwebKey.ipns:
          return $tt('Incorrect {fieldName} CID or domain host', { fieldName: fieldName })
        default:
          return $tt('Invalid {fieldName}', { fieldName: fieldName })
      }
    }
  })

  // integer
  extend('integer', {
    ...integer,
    message: (fieldName): string => {
      return $tt('{fieldName} must be an integer', { fieldName: fieldName })
    },
  })
}
