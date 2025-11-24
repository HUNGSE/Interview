using System.ComponentModel.DataAnnotations;

namespace ProductApi.Entities
{
    public class Product
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public string Name { get; set; }
        public string? Description { get; set; }

        public string Sku { get; set; }

        public decimal BasePrice { get; set; }

        public Guid CategoryId { get; set; }
        public Category? Category { get; set; }

        public bool IsActive { get; set; } = true;

        public List<ProductVariant> Variants { get; set; } = new();
        public List<ProductImage> Images { get; set; } = new();

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [Timestamp]
        public byte[]? RowVersion { get; set; }
    }

}
