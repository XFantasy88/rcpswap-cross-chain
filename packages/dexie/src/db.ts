import { Dexie, type Table } from 'dexie'

import { type Transaction } from './transactions/index.js'

export class RCPSwapDexie extends Dexie {
  transactions!: Table<Transaction>

  constructor() {
    super('rcpswap')
    this.version(1).stores({
      transactions:
        'hash, account, chainId, summary, receipt, lastCheckedBlockNumber, addedTime, confirmedTime, from',
    })
  }
}

export const db = new RCPSwapDexie()
