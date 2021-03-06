// tslint:disable: no-console
globalThis.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest
globalThis.window = {} as any
globalThis.document = {} as any

import { ImageId } from '@ag/core/context'
import { FI, filist, formatAddress } from '@ag/core/data'
import { selectors } from '@ag/core/reducers'
import { thunks } from '@ag/core/thunks'
import { dbWrite } from '@ag/core/thunks/dbWrite'
import { Account, AccountType, Bank, Bill, DbChange, Image, Transaction } from '@ag/db'
import { exportDb, exportExt } from '@ag/db/export'
import { online } from '@ag/online'
import { imageBufToUri, makeDate } from '@ag/util'
import console = require('console')
import crypto from 'crypto'
import { CurrencyCode } from 'currency-code-map'
import debug from 'debug'
import faker from 'faker'
import fs from 'fs'
import { RRule } from 'rrule'
import { Connection, ConnectionOptions, createConnection, getConnectionManager } from 'typeorm'
import { createStore, sys, waitForState } from '../stories/storybookStore'

debug.enable('*,-online:*')
// debug.enable('*')

interface BankInfo {
  fi: FI
  accounts: Array<{
    name: string
    cardImage?: string
    currencyCode?: CurrencyCode
    txs: number
  }>
}

interface BillInfo {
  payee: string
  description: string
  amount: number
  url: string
  recur: 'biweekly' | 'monthly' | 'bimonthly' | 'yearly'
  start: Date
}

const seed = 123

const cardImages = {
  amex:
    // tslint:disable-next-line: max-line-length
    'https://icm.aexp-static.com/Internet/Acquisition/US_en/AppContent/OneSite/category/cardarts/blue-cash-preferred.png',
  chaseFreedom: 'https://creditcards.chase.com/K-Marketplace/images/cardart/freedom_card.png',
  chaseSapphire:
    'https://creditcards.chase.com/K-Marketplace/images/cardart/sapphire_preferred_card.png',
  citi: 'https://www.citi.com/CRD/images/card_no_reflection/citi-simplicity-credit-card.jpg',
  discover:
    'https://www.discover.com/content/dam/dfs/credit-cards/images/cards/Business-Card_176x122.png',
}

async function main() {
  faker.seed(seed)

  const changes: DbChange[] = []
  const txs = 1000

  window.SQL = await require('sql.js/dist/sql-asm.js')()

  const bankInfos: Record<string, BankInfo> = {
    amex: {
      fi: getBank('American Express', 'https://www.americanexpress.com/'),
      accounts: [{ name: 'American Express', cardImage: cardImages.amex, txs: 1 }],
    },
    chase: {
      fi: getBank('Chase', 'https://chase.com'),
      accounts: [
        { name: 'Chase Sapphire', cardImage: cardImages.chaseSapphire, txs },
        { name: 'Chase Freedom', cardImage: cardImages.chaseFreedom, txs },
        { name: 'Checking', txs },
        { name: 'Vacation Savings', txs },
        { name: 'House Savings', txs },
        { name: 'College Savings', txs },
        { name: 'Kids Savings', txs },
        { name: 'Shared Savings', txs },
        { name: 'Mortgage', txs },
        { name: 'Home Equity Line of Credit', txs },
        { name: 'Checking 2', txs },
      ],
    },
    citi: {
      fi: getBank('Citi Cards', 'https://online.citi.com/'),
      accounts: [
        { name: 'Citi Savings', txs: 0 },
        { name: 'Citi Checking', txs },
        { name: 'Citi Credit', cardImage: cardImages.citi, txs },
      ],
    },
    discover: {
      fi: getBank('Discover Card'),
      accounts: [{ name: 'Discover', currencyCode: 'EUR', cardImage: cardImages.discover, txs }],
    },
    etrade: {
      fi: getBank('E*TRADE Financial'),
      accounts: [{ name: 'E*Trade Checking', txs }],
    },
  }

  const s = createStore({ online, ui: {} as any, sys: { ...sys, openDb } })
  await s.dispatch(thunks.init())
  await s.dispatch(thunks.dbCreate({ name: 'app', password: '1234' }))

  const err = selectors.appError(s.getState())
  if (err) {
    throw err
  }

  let t = 10000

  for (const bankInfo of Object.values(bankInfos)) {
    console.log('processing bank ' + bankInfo.fi.name)
    const bankUri = await getFavico(bankInfo.fi.profile.siteURL)
    const [bankImageId, bankImageChanges] = Image.change.create(t, bankUri)
    changes.push(...bankImageChanges)

    const bank = new Bank(hashId(bankInfo.fi.name), {
      name: bankInfo.fi.name,
      web: bankInfo.fi.profile.siteURL,
      address: formatAddress(bankInfo.fi),
      notes: `notes for ${bankInfo.fi.name}\nmore notes`,
      iconId: bankImageId,

      online: true,

      fid: bankInfo.fi.fid,
      org: bankInfo.fi.org,
      ofx: bankInfo.fi.ofx,

      username: faker.internet.userName(),
      password: faker.internet.password(),
    })

    changes.push(Bank.change.add(t, bank))
    await s.dispatch(dbWrite(changes))
    changes.length = 0
    t++

    for (const accountInfo of bankInfo.accounts) {
      console.log('  account ' + accountInfo.name)
      let cardImageId: ImageId = ''
      if (accountInfo.cardImage) {
        const uri = await getImage(accountInfo.cardImage)
        const [imageId, imgChanges] = Image.change.create(t, uri)
        changes.push(...imgChanges)
        cardImageId = imageId!
      }

      const type =
        accountInfo.name.toLowerCase().indexOf('credit') !== -1
          ? AccountType.CREDITCARD
          : accountInfo.name.toLowerCase().indexOf('savings') !== -1
          ? AccountType.SAVINGS
          : accountInfo.name.toLowerCase().indexOf('checking') !== -1
          ? AccountType.CHECKING
          : AccountType.CREDITCARD

      const account = new Account(hashId(bank.id + accountInfo.name), {
        ...Account.defaultValues(),

        bankId: bank.id,
        name: accountInfo.name,
        color: Account.generateColor(type, seed),
        type,
        number: faker.finance.account(),
        visible: true,
        routing: faker.finance.account(10),
        iconId: cardImageId,
        currencyCode: accountInfo.currencyCode || Account.defaultCurrencyCode,
        sortOrder: bankInfo.accounts.indexOf(accountInfo),
      })

      changes.push(Account.change.add(t, account))
      await s.dispatch(dbWrite(changes))
      changes.length = 0
      t++

      const transactions: Transaction[] = []
      console.log('    ' + accountInfo.txs + ' transactions')
      for (let i = 0; i < accountInfo.txs; i++) {
        const tx = new Transaction(hashId(account.id + i), {
          ...Transaction.defaultValues(),
          accountId: account.id,
          time: faker.date.recent(365 * 3),
          name: faker.company.companyName(),
          memo: faker.commerce.productName(),
          amount: parseFloat(faker.commerce.price()) * (faker.random.boolean() ? -1 : 1),
        })
        transactions.push(tx)
      }

      changes.push(Transaction.change.add(t, transactions))
      changes.push(
        ...Account.change.addTx(
          t,
          account.id,
          transactions.reduce((total, tx) => total + tx.amount, 0)
        )
      )
      await s.dispatch(dbWrite(changes))
      changes.length = 0
      t++
    }
  }

  const billInfos: BillInfo[] = [
    {
      payee: 'Netflix',
      description: '',
      amount: -12.99,
      url: 'http://netflix.com',
      recur: 'monthly',
      start: makeDate({ year: 2012, month: 7, day: 12 }),
    },
    {
      payee: 'Hulu',
      description: '',
      amount: -9.99,
      url: 'http://hulu.com',
      recur: 'monthly',
      start: makeDate({ year: 2015, month: 2, day: 3 }),
    },
    {
      payee: 'Amazon',
      description: 'Amazon Prime',
      amount: -120.0,
      url: 'http://amazon.com',
      recur: 'yearly',
      start: makeDate({ year: 2017, month: 11, day: 1 }),
    },
    {
      payee: 'Cal Water',
      description: 'Water',
      amount: -28.55,
      url: 'https://www.calwater.com/',
      recur: 'bimonthly',
      start: makeDate({ year: 2015, month: 3, day: 15 }),
    },
    {
      payee: 'National Fuel',
      description: 'Utilities',
      amount: -55.0,
      url: 'https://natfuel.com/',
      recur: 'monthly',
      start: makeDate({ year: 2017, month: 11, day: 1 }),
    },
    {
      payee: 'AT&T',
      description: '',
      amount: -89.99,
      url: 'https://att.com/',
      recur: 'monthly',
      start: makeDate({ year: 2017, month: 3, day: 1 }),
    },
    {
      payee: 'IBM',
      description: '',
      amount: 1000.0,
      url: 'https://ibm.com/',
      recur: 'biweekly',
      start: makeDate({ year: 2013, month: 4, day: 1 }),
    },
    {
      payee: 'Bank of America',
      description: 'Mortgage',
      amount: -1500.0,
      url: 'https://www.bankofamerica.com',
      recur: 'monthly',
      start: makeDate({ year: 2014, month: 4, day: 1 }),
    },
  ]

  for (const billInfo of billInfos) {
    console.log('adding bill ' + billInfo.payee)
    const billUri = await getFavico(billInfo.url)
    const [billImageId, billImageChanges] = Image.change.create(t, billUri)

    const bill = new Bill(hashId(billInfo.payee + billInfo.description), {
      ...Bill.defaultValues,
      amount: billInfo.amount,
      name: billInfo.payee,
      notes: billInfo.description,
      sortOrder: billInfos.indexOf(billInfo),
      web: billInfo.url,
      rruleString: makeRrule(billInfo),
      iconId: billImageId,
    })

    changes.push(...billImageChanges)
    changes.push(Bill.change.add(t, bill))
    await s.dispatch(dbWrite(changes))
    changes.length = 0
    t++
  }

  const { connection } = selectors.appDb(s.getState())
  const data = await exportDb(connection)
  const path = `./stories/data/asdf.${exportExt}`
  fs.writeFileSync(path, data, { encoding: 'base64' })

  console.log('saved ', path)
}

main().catch(err => console.error(err))

const makeRrule = (billInfo: BillInfo): string => {
  const dtstart = billInfo.start
  switch (billInfo.recur) {
    case 'yearly':
      return new RRule({ dtstart, freq: RRule.YEARLY }).toString()

    case 'bimonthly':
      return new RRule({ dtstart, freq: RRule.MONTHLY, interval: 2 }).toString()

    case 'monthly':
      return new RRule({ dtstart, freq: RRule.MONTHLY }).toString()

    case 'biweekly':
      return new RRule({ dtstart, freq: RRule.WEEKLY, interval: 2 }).toString()
  }
}

const getBank = (name: string, siteURL?: string) => {
  const bank = filist.find(fi => fi.name === name)
  if (!bank) {
    throw new Error('cannot find bank ' + name)
  }
  if (siteURL) {
    bank.profile.siteURL = siteURL
  }
  return bank
}

const getFavico = async (url: string) => {
  // console.log('downloading ' + url)
  const source = online.CancelToken.source()
  const favico = await online.getFavico(url, source.token, Bank.iconSize, Bank.iconSize)

  if (!favico) {
    throw new Error('failed to download favico from ' + url)
  }
  const uri = imageBufToUri(favico)
  return uri
}

const getImage = async (cardImage: string) => {
  // console.log('downloading ' + cardImage)
  const source = online.CancelToken.source()
  const buf = await online.getImage(cardImage, source.token)
  return imageBufToUri(buf)
}

const openDb = async (
  name: string,
  key: string,
  entities: ConnectionOptions['entities']
): Promise<Connection> => {
  const mgr = getConnectionManager()
  if (mgr.has(name)) {
    await mgr.get(name).close()
  }

  // log('opening %s', name)
  const db = await createConnection({
    name,
    type: 'sqlite',
    synchronize: true,
    database: ':memory:',
    entities,
    // logging: true,
  })
  return db
}

const hashId = (name: string) => {
  const hash = crypto.createHash('sha1')
  hash.update(name)
  return 'a' + hash.digest('hex')
}
