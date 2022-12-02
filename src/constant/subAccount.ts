export enum SUB_ACCOUNT_ENABLE_STATUS {
  unknown = -1,
  off,
  on
}

export enum CHECK_SUB_ACCOUNT_STATUS {
  ok,
  fail,
  registered,
  registering
}

export const SUB_ACCOUNT_ACTIONS = {
  enableSubAccount: 'enable_sub_account',
  createSubAccount: 'create_sub_account',
  owner: 'owner',
  manager: 'manager',
  records: 'records',
  edit_sub_account: 'edit_sub_account',
  collect_sub_account_profit: 'collect_sub_account_profit'
}

export const SUB_ACCOUNT_REG_EXP = /.{1,42}[.|#].{1,42}.bit$/
