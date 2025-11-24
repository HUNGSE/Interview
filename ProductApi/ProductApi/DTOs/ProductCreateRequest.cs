using System.ComponentModel.DataAnnotations;

namespace ProductApi.DTOs
{
    public class ProductCreateRequest
    {
        [Required]
        [StringLength(200)]
        public string Name { get; set; }

        [StringLength(500)]
        public string? Description { get; set; }

        [Required]
        [StringLength(100)]
        public string Sku { get; set; }

        [Range(0, double.MaxValue)]
        public decimal BasePrice { get; set; }

        [Required]
        public Guid CategoryId { get; set; }

        public List<ProductVariantRequest> Variants { get; set; } = new();
        public List<string> ImageUrls { get; set; } = new();

    }
}
