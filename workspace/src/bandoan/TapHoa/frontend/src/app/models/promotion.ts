export enum PromotionType {
    PercentageOff = 1,
    FixedAmountOff = 2,
    BuyXGetY = 3
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
}
