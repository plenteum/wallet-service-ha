'use strict'

const WalletService = require('./')
const util = require('util')

var wallet = new WalletService({
  containerFile: './container.walletd',
  rpcPassword: 'changeme'
})

function log (message) {
  console.log(util.format('%s: %s', (new Date()).toUTCString(), message))
}

wallet.on('error', (err) => {
  log(util.format('[ERROR]: %s', err))
})

wallet.on('info', (info) => {
  log(util.format('[INFO]: %s', info))
})

wallet.on('warning', (warn) => {
  log(util.format('[WARNING]: %s', warn))
})

wallet.on('status', (status) => {
  log(util.format('Synced %s out of %s blocks (%s%)', status.blockCount, status.knownBlockCount, Math.round((status.blockCount / status.knownBlockCount) * 100, 1)))
})

wallet.on('synced', () => {
  log('Wallet is synchronized')
})

wallet.on('save', () => {
  log('Wallet saved')
})

wallet.on('down', () => {
  log('WalletService is not responding... stopping process...')
  wallet.stop()
})

wallet.on('scan', (fromBlock, toBlock) => {
  log(util.format('Scanning block %s to %s', fromBlock, toBlock))
})

wallet.on('transcation', (transaction) => {
  log(util.format('%s transaction %s %s in the amount of %s', (transaction.inbound) ? 'incoming' : 'outgoing', (transaction.inbound) ? 'to' : 'from', transaction.address, transaction.amount))
})

wallet.on('data', (data) => {

})

wallet.on('close', (exitcode) => {
  log(util.format('WalletService has closed (exitcode: %s)... restarting process...', exitcode))
  wallet.start()
})

wallet.start()
