export enum PromotionType {
    PercentageOff = 1,
    FixedAmountOff = 2,
    BuyXGetY = 3,
    CouponCode = 4,
    CategoryDiscount = 5
}

export interface Promotion {
    id: string;
    name: string;
    description?: string;
    type: PromotionType;
    minOrderAmount: number;
    startDate?: string | null;
    endDate?: string | null;
    isActive: boolean;
    discountValue: number;
    buyQuantity?: number | null;
    getQuantity?: number | null;
    targetProductId?: string | null;
    // Advanced fields
    couponCode?: string | null;
    maxUsageCount?: number | null;
    currentUsageCount: number;
    applicableCategoryId?: string | null;
    maxDiscountAmount?: number | null;
}

export interface ApplicablePromotionResult {
    id: string;
    name: string;
    description?: string;
    type: PromotionType;
    discountValue: number;
    calculatedDiscount: number;
    couponCode?: string;
}

export interface ApplyCouponCodeResult {
    isValid: boolean;
    errorMessage?: string;
    promotionId?: string;
    promotionName?: string;
    calculatedDiscount: number;
}
