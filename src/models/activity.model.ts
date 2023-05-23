import { sequelize } from '.'
import { DataTypes, Model } from 'sequelize'
import { IActivity } from '../types';

export const Activity = sequelize.define<Model<IActivity>>('Activity', {
  contract_address: {
    type: DataTypes.STRING
  },
  token_index: {
    type: DataTypes.STRING
  },
  listing_price: {
    type: DataTypes.DECIMAL(10,4)
  },
  maker: {
    type: DataTypes.STRING
  },
  listing_from: {
    type: DataTypes.INTEGER
  },
  listing_to: {
    type: DataTypes.INTEGER
  },
  event_timestamp : {
    type: DataTypes.DATE
  }
})
