namespace ProductApi.Entities
{
    public class ProductVariant
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid ProductId { get; set; }
        public Product? Product { get; set; }

        public string? Color { get; set; }
        public string? Size { get; set; }

        public decimal AdditionalPrice { get; set; }

        public int StockQuantity { get; set; }
    }
}
