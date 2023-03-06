export interface ProductItem {
    id: String;
    name: String;
    price: number;
    currency: String;
    rebateQuantity: number;
    rebatePercent: number;
    upsellProductId: String | null;
}
