namespace ProductApi.DTOs
{
    public class ProductResponse
    {
        public Guid Id { get; set; }

        public string Name { get; set; }
        public string? Description { get; set; }
        public string Sku { get; set; }
        public decimal BasePrice { get; set; }

        public Guid CategoryId { get; set; }
        public string? CategoryName { get; set; }

        public bool IsActive { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public byte[] RowVersion { get; set; }

        public List<ProductVariantResponse> Variants { get; set; } = new();
        public List<string> ImageUrls { get; set; } = new();

    }

    public class ProductVariantResponse
    {
        public Guid Id { get; set; }
        public string? Color { get; set; }
        public string? Size { get; set; }
        public decimal AdditionalPrice { get; set; }
        public int StockQuantity { get; set; }
    }
}
