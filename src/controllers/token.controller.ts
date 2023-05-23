import { Activity } from '../models/activity.model';
import { Token } from '../models/token.model';
import { IActivity } from '../types';

export const processTokens = async (data: IActivity) => {
  const { listing_to, contract_address, token_index, listing_price } = data;
  const token = await Token.findOne({
    where: { index: token_index, contract_address },
  });
  if (!token) {
    await Token.create({
      index: token_index,
      contract_address,
      current_price: listing_price,
    });
  } else {
    const now = Date.now();
    if (listing_to < now) {
      const activity = await Activity.findAll({
        where: { contract_address, token_index, listing_to: { $gt: now } },
        order: [['listing_price', 'ASC']],
      });
      if (activity.length === 0) {
        await token.update({ current_price: null });
      } else {
        const { listing_price: leastPrice } = activity[0].toJSON();
        await token.update({ current_price: leastPrice });
      }
    } else {
      const { current_price } = token.toJSON();
      const leastPrice = current_price
        ? Math.min(current_price, listing_price)
        : listing_price;
      await token.update({ current_price: leastPrice });
    }
  }
};
