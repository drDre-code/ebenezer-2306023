import logger from '../logger';
import { Activity } from '../models/activity.model'
import { Token } from '../models/token.model'
import { IActivity } from '../types';

export const processTokens = async (data: IActivity) => {
  const { listing_to, contract_address, token_index, listing_price } = data
  const token = await Token.findOne({
    where: { index: token_index, contract_address }
  })
  if (!token) {
    await Token.create({
      index: token_index,
      contract_address,
      current_price: listing_price
    })
  } else {
    const now = Date.now()
    if (listing_to < now) {
      const activity = await Activity.findAll({
        where: { contract_address, token_index, listing_to: { $gt: now } },
        order: [['listing_price', 'ASC']]
      })
      if (activity.length === 0) {
        await token.update({ current_price: null })
        logger.info(`Token ${token_index} has expired`)
      } else {
        const { listing_price } = activity[0].toJSON()
        await token.update({ current_price: listing_price })
        logger.info(`Token ${token_index} has been updated`)
      }
    }
  }
}
