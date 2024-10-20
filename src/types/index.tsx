import { MouseEventHandler } from "react";

export interface customButtonProps {
  title: string;
  containerStyles?: String;
  handleClick?: MouseEventHandler<HTMLButtonElement>;
  btnType?: "button" | "submit";
  textStyles?: string;
  Icon?: string;
  isDisabled?: boolean;
  loading?: boolean;
  noPadding?: boolean;
}

export interface customImageButtonProps {
  title: string;
  containerStyles?: String;
  handleClick?: MouseEventHandler<HTMLButtonElement>;
  btnType?: "button" | "submit";
  textStyles?: string;
  rightIcon?: string;
  img?: string;
  isDisabled?: boolean;
}

export interface GoldData {
  c_parity: number;
  c_saleParity: number;
  c_salePrice: number;
  c_totalPrice: number;
  isRealTime: true,
  mcx: number;
  parity: number;
  percentage: number;
  saleParity: number;
  salePrice: number;
  totalPrice: number;
  up: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  _id: string
}

export interface SilverData {
  c_parity: number;
  c_saleParity: number;
  c_salePrice: number;
  c_totalPrice: number;
  isRealTime: true,
  mcx: number;
  parity: number;
  percentage: number;
  saleParity: number;
  salePrice: number;
  totalPrice: number;
  up: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  _id: string
}

export interface Coupon {
  code: string;
  createdAt: string;
  isVisible: boolean;
  description: string;
  expiryDate: string;
  itemType: string;
  maximum: number;
  minimum: number;
  percentage: number;
  status: boolean;
  type: string;
  updatedAt: string;
  used_count: number;
  __v: number;
  _id: string;
}

export interface CouponState {
  selectedCoupon: Coupon | null;
  appliedCouponCode: string | null;
  error: string | null;
  extraGoldOfRuppess: number;
  extraGold: number;
  coupons: Coupon[]; // Array to store available coupons
}

export type MetalType = "gold" | "silver";
export type PurchaseType = "buy" | "sell";
export type TransactionType = "grams" | "rupees";
export type metalPrice = number;

export interface ShopState {
  purchaseType: PurchaseType;
  metalType: MetalType;
  transactionType: TransactionType;
  enteredAmount: number;
  actualAmount: number;
  gst: number;
  metalPrice: number;
  metalQuantity: number;
  totalAmount: number;
  transactionFrom: string;
}

export interface UserReward {
  amount: number;
  createdAt: string;
  description: string;
  expireAt: string;
  gram: number;
  itemType: string;
  redeemAt: string;
  rewardsType: string;
  status: string;
  updatedAt: string;
  user_gifting_id: string;
  user_id: string;
  user_refer_id: string | null;
  __v: number;
  _id: string;
}

export interface GiftState {
  metalType: MetalType;
  transactionType: TransactionType;
  enteredAmount: number;
  actualAmount: number;
  metalPrice: number;
  metalQuantity: number;
  totalAmount: number;
}

export interface OtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitVerify: (event: React.FormEvent<HTMLFormElement>) => void;
  handleOTPChange: (otp: string) => void;
  otp: string;
  otpError: string;
  isSubmitting: boolean;
}

export interface Wallet {
  createdAt: null;
  gold: number;
  goldAvgPrice: number;
  goldCurrentValue: number;
  holdGoldGram: number;
  holdSilverGram: number;
  silver: number;
  silverAvgPrice: number;
  silverCurrentValue: number;
  totalAmount: number;
  updatedAt: String;
  user_id: String;
  _id: String;
}

export interface UserState {
  data: {
    address: {
      line1: string;
      line2: string;
      pincode: number | null;
      state: string;
      city: string;
    };
    addresses: Array<{
      line1: string;
      line2: string;
      pincode: number | null;
      state: string;
      city: string;
    }>;
    bankDetails: {
      bankName: string;
      accountName: string;
      ifsc: string;
      accountNumber: string;
      upiId: string;
    };
    createdAt: string;
    dateOfBirth: string;
    email: string;
    enabled: boolean;
    fromApp: boolean;
    gender: string;
    gst_number: string;
    isAadhaarUploaded: boolean;
    isAddressCompleted: boolean;
    isBankDetailsCompleted: boolean;
    isBasicDetailsCompleted: boolean;
    isEmailVerified: boolean;
    isKycDone: boolean;
    isMobileVerified: boolean;
    isNewUser: boolean;
    isPanUploaded: boolean;
    isUpiVerified: boolean;
    kyc: {
      panNumber: string;
      aadhaarNumber: string;
    };
    legalName: string;
    mobile_number: string;
    name: string;
    profile_image: string;
    referralCode: string;
    referredBy: string | null;
    tradeName: string;
    type: string;
    updatedAt: string;
    userId: string;
    user_vaults: {
      _id: string;
      user_id: string;
      gold: number;
      silver: number;
      totalAmount: number;
      createdAt: string;
      updatedAt: string;
    };
    verificationToken: string;
    walletAmount: number;
    __v: number;
    _id: string;
  };
}

export interface PreviewItem {
  key: string;
  value: string;
}
export interface AddressModalProps {
  applyDiwaliOffer: boolean;
  previewData: PreviewItem[];
  openAddressModal: boolean;
  closeAddressModal: () => void;
  productsDetailById: any;
  transactionId: string;
  totalAmountValue: number;
  metalTypeForProgressBar: any;
}

export interface Address {
  _id: string;
  createdAt: string;
  isDefault: boolean;
  updatedAt: string;
  user_id: string;
  _v: number;
  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    pincode: string;
  };
}
export interface Image {
  image: string;
  image1: string;
  image2: string;
  image3: string;
}
export interface Product {
  coinHave: number;
  count: number;
  dimension: string;
  image: Image;
  inStock: boolean;
  iteamtype: string;
  makingcharges: string;
  maxForCart: number;
  name: string;
  purity: string;
  sku: string;
  weight: number;
  _id: string;
}

export interface CartProduct {
  product: Product;
}

export interface CartState {
  products: CartProduct[];
  totalGoldWeight: number;
  totalSilverWeight: number;
  totalMakingCharges: number;
  totalMakingWithoutTax: number;
  amountWithTaxGold: number;
  amountWithoutTaxGold: number;
  amountWithTaxSilver: number;
  amountWithoutTaxSilver: number;
  useVaultBalanceGold: boolean;
  useVaultBalanceSilver: boolean;
  goldVaultBalance: number;
  silverVaultBalance: number;
  purchasedGoldWeight: number;
  purchasedSilverWeight: number;
  goldGstForCart: number;
  silverGstForCart: number;
  liveGoldPrice: number;
  liveGoldPurchasePrice: number;
  liveSilverPrice: number;
  liveSilverPurchasePrice: number;
  finalAmount: number;
  totalMakingChargesGold: number;
  totalMakingChargesSilver: number;
  totalGoldCoins: number;
  totalSilverCoins: number;
  goldVaultWeightUsed: number;
  silverVaultWeightUsed: number;
}
