namespace ProductApi.DTOs
{
    public class ProductVariantRequest
    {
        public Guid? Id { get; set; }  
        public string? Color { get; set; }
        public string? Size { get; set; }
        public decimal AdditionalPrice { get; set; }
        public int StockQuantity { get; set; }
    }
}
