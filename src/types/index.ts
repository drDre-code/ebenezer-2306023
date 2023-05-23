export type IActivity = {
  contract_address: string
  token_index: string
  listing_price: number
  maker: string
  listing_from: number
  listing_to: number
  event_timestamp: Date
};

export type IToken = {
  id?: string
  index: string
  contract_address: string
  current_price: number | null
}
