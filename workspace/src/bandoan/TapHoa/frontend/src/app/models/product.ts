export interface Product {
    id: string;
    name: string;
    category: string;
    mainImageUrl?: string;
    additionalImages?: string[];
    price: number;
    stockQuantity: number;
    unit: string;
    status: string;
}
