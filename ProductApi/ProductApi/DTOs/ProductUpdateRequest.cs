using System.ComponentModel.DataAnnotations;

namespace ProductApi.DTOs
{
    public class ProductUpdateRequest
    {
        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Description { get; set; }

        [Range(0, double.MaxValue)]
        public decimal BasePrice { get; set; }

        [Required]
        public Guid CategoryId { get; set; }

        [Required]
        public byte[] RowVersion { get; set; } = default!;

        [Required]
        public List<ProductVariantRequest> Variants { get; set; } = new();

        [Required]
        public List<string> ImageUrls { get; set; } = new();
    }
}
