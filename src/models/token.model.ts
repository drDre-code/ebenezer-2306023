import { DataTypes, Model } from 'sequelize';
import { sequelize } from '.';
import { IToken } from '../types';

export const Token = sequelize.define<Model<IToken>>('Token', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  index: {
    type: DataTypes.STRING,
  },
  contract_address: {
    type: DataTypes.STRING,
  },
  current_price: {
    type: DataTypes.DECIMAL(10, 4),
    allowNull: true,
  },
});
