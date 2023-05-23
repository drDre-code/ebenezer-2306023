import fetch from 'node-fetch'
import logger from '../logger'
import { Activity } from '../models/activity.model'
import eventEmitter from '../event'
import { log } from 'console';

const buildAPIUrl = (
  from: number,
  to: number,
  continuation: string | null = null
): string => {
  const baseUrl = 'https://api.reservoir.tools/events/asks/v3?limit=1000'
  const url = new URL(baseUrl)
  url.searchParams.append('startTimestamp', from.toString())
  url.searchParams.append('endTimestamp', to.toString())
  if (continuation) {
    url.searchParams.append('continuation', continuation)
  }
  return url.toString()
}

const DatetoUnix = (date: number): number => Math.floor(date / 1000)

const processEvents = async (events: any[]): Promise<void> => {
  const newOrders = events.filter(({ event }) => event.kind == 'new-order')
  newOrders.forEach(({ order, event }) => {
    const data = {
      contract_address: order.contract,
      token_index: order.criteria.data.token.tokenId,
      listing_price: order.price.amount.native,
      maker: order.maker,
      listing_from: order.validFrom,
      listing_to: order.validUntil,
      event_timestamp: event.createdAt
    }
    
    Activity.create(data)
      .then((res) => {
        eventEmitter.emit('newEvent', res.toJSON())
      })
      .catch((err) => {
        logger.error(err)
      })
  })
  logger.info(`Processed ${newOrders.length} new orders`)
}

const fetchAndProcessEvents = async (
  from: number,
  to: number,
  cont: string | null = null
): Promise<void> => {
  const url = buildAPIUrl(from, to, cont)
  const response = await fetch(url)
  const { events, continuation } = await response.json()
  if (events.length > 0) {
    await processEvents(events)
  }
  if (continuation) {
    await fetchAndProcessEvents(from, to, continuation)
  }
}

export const getNewEvents = async () => {
  const date = new Date().toISOString()
  logger.info(`Fetching new events from ${date}`)
  const endDate = new Date(date).getTime()
  const startDate = endDate - 1000 * 60 // 1 minute before
  const startDatetoUnix = DatetoUnix(startDate)
  const endDatetoUnix = DatetoUnix(endDate)
  await fetchAndProcessEvents(startDatetoUnix, endDatetoUnix)
  logger.info(`Done fetching new events from ${date}`)
}
