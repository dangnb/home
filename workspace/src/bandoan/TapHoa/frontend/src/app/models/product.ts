export interface Product {
    id: number;
    name: string;
    category: string;
    mainImageUrl?: string;
    additionalImages?: string[];
    price: number;
    stockQuantity: number;
    unit: string;
    status: string;
}
