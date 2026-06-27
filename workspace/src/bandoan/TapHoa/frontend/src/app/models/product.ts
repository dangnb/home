export interface Product {
    id: string;
    name: string;
    categoryId?: string;
    categoryName?: string;
    mainImageUrl?: string;
    additionalImages?: string[];
    costPrice: number;
    wholesalePrice: number;
    price: number;
    stockQuantity: number;
    unit: string;
    status: string;
    units?: ProductUnit[];
}

export interface ProductUnit {
    id?: string;
    unitName: string;
    conversionFactor: number;
    barcode?: string;
    price: number;
}
