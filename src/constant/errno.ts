export default {
  success: 0,
  networkError: -1,
  // api error
  apiErrorCodeNotOpenForRegistration: 30001,
  apiErrorCodeAccountNotExist: 30003,
  apiErrorCodeOrderStatusExpired: 30008,
  apiErrorCodeAccountCharsErr: 30015,
  apiErrorCodeSystemUpgrade: 30019,
  apiErrorCodeAccountFrequencyLimit: 11013,
  apiErrorCodeAccountIsExpired: 30010,
  apiErrorCodeNotHaveOwnerPermission: 30011,
  apiErrorCodeTransferAccountSameAddress: 30023,
  apiErrorCodeWithdrawFromDasLockInsufficientBalance: 30025,
  apiErrorCodeWithdrawFromDasLockUnsupportedLongAddress: 30030,
  apiErrorCodeAccountOnSaleOrAuction: 30031,
  apiErrorCodeAfterGracePeriod: 30037,
  apiErrorCodeInsufficientBalance: 11007,
  apiErrorCodeResolveFailed: 11011,
  apiErrorCodeNotEnoughChange: 11014,
  apiErrorCodeNotExitsTrx: 11001,
  apiErrorCodeReverseAlreadyExist: 12001,
  apiErrorCodeMintSubAccountsTaskInProgress: 40008,
  apiErrorCodeMintSubAccountsCheckFailed: 40007,
  apiErrorCodeTaskNotCompleted: 40010,
  apiErrorCodeNoPermissionsMintSubAccounts: 40011,
  apiErrorCodeSubAccountsCustomScriptSet: 40018,
  apiErrorCodeProfitNotEnough: 40019,
  // MetaMask
  metaMaskUserDeniedMessageSignature: 4001,
  metaMaskWalletRequestPermissions: -32002,
  metaMaskUserRejectedAccountAccess: -32603,
  // WalletConnect
  walletConnectUserRejectedTheTransaction: 'User rejected the transaction',
  walletConnectInsufficientFundsForTransfer: 'insufficient funds for transfer',
  // TronLink
  tronLinkConfirmationDeclinedByUser: 'Confirmation declined by user',
  tronLinkInsufficientBalance: 'class org.tron.core.exception.ContractValidateException : Validate TransferContract error, no OwnerAccount.',
  tronLinkTypeErrorAddUpdateDataNotFunction: 'transactionBuilder.addUpdateData',
  tronLinkAuthorizationRequestsAreBeingProcessed: 4000,
  // imToken
  imTokenUserCanceled: 'user_canceled',
  // coinbase wallet
  coinbaseWalletUsingMultipleWallet: 'Request method eth_chainId is not supported',
  // Portal Wallet
  portalWalletInsufficientBalance: 'input capacity not enough',
  portalWalletValidationFailure: 'ValidationFailure(-31)',
}
