export enum MembershipType {
  ANNUALBASIC = 'annualbasic',
  MONTHLYPREMIUM = 'monthlypremium',
  ANNUALPREMIUM = 'annualpremium',
  MONTHLYBASIC = 'monthlybasic',
}

export enum MembershipStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
}

export enum PaymentStatus {
  PAID = 'paid',
  UNPAID = 'unpaid',
}

export interface MembershipDto {
  membershipType: string;
  totalAmount: number;
  startDate: string;
}

export interface MembershipDates {
  dueDate: Date;
  monthlyDate?: Date;
}

export enum PaymentMethod {
  CASH = 'cash',
  CARD = 'card',
  TRANSFER = 'transfer',
  PAYPAL = 'paypal',
  STRIPE = 'stripe',
  APPLE_PAY = 'apple_pay',
  GOOGLE_PAY = 'google_pay',
  SAMSUNG_PAY = 'samsung_pay',
  VENMO = 'venmo',
  ZELLE = 'zelle',
  BITCOIN = 'bitcoin',
  ETHEREUM = 'ethereum',
  LITECOIN = 'litecoin',
  RIPPLE = 'ripple',
  MONERO = 'monero',
  DASH = 'dash',
  NEM = 'nem',
  EOS = 'eos',
  CARDANO = 'cardano',
  TEZOS = 'tezos',
  TRON = 'tron',
  BINANCE_COIN = 'binance_coin',
  CHAINLINK = 'chainlink',
  POLKADOT = 'polkadot',
  DOGECOIN = 'dogecoin',
  SHIBA_INU = 'shiba_inu',
  SAFEMOON = 'safemoon',
  CUMMIES = 'cummies',
  OTHER = 'other',
}

export interface AddMembership {
  memberId: string;
  firstName: string;
  lastName: string;
  membershipType: MembershipType;
  email: string;
  phone: string;
  password: string;
  dob?: Date;
  address?: string;
  photo?: string;
  startDate: Date;
  dueDate: Date;
  monthlyDueDate?: Date;
  totalAmount?: number;
  status: MembershipStatus;
  createdAt: Date;
}
