using Microsoft.EntityFrameworkCore;
using ProductApi.DTOs;
using ProductApi.Entities;
using ProductApi.Repositories;

namespace ProductApi.Services
{
    public class ProductService
    {
        private readonly IProductRepository _repo;

        public ProductService(IProductRepository repo)
        {
            _repo = repo;
        }

        public async Task<ProductResponse> CreateAsync(ProductCreateRequest request)
        {
            if (await _repo.SkuExistsAsync(request.Sku))
                throw new InvalidOperationException("SKU already exists.");

            var product = new Product
            {
                Name = request.Name,
                Description = request.Description,
                Sku = request.Sku,
                BasePrice = request.BasePrice,
                CategoryId = request.CategoryId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                Variants = request.Variants.Select(v => new ProductVariant
                {
                    Color = v.Color,
                    Size = v.Size,
                    AdditionalPrice = v.AdditionalPrice,
                    StockQuantity = v.StockQuantity
                }).ToList(),
                Images = request.ImageUrls.Select((url, idx) => new ProductImage
                {
                    ImageUrl = url,
                    IsPrimary = idx == 0
                }).ToList()
            };

            await _repo.AddAsync(product);
            await _repo.SaveChangesAsync();

            return MapToResponse(product);
        }

        public async Task<ProductResponse?> GetByIdAsync(Guid id)
        {
            var product = await _repo.GetByIdAsync(id);
            return product == null ? null : MapToResponse(product);
        }

        public async Task<(List<ProductResponse> Items, int Total)> GetPagedAsync(
            string? search,
            Guid? categoryId,
            decimal? minPrice,
            decimal? maxPrice,
            int page,
            int pageSize)
        {
            var (items, total) = await _repo.GetPagedAsync(search, categoryId, minPrice, maxPrice, page, pageSize);
            var result = items.Select(MapToResponse).ToList();
            return (result, total);
        }

        public async Task UpdateAsync(Guid id, ProductUpdateRequest request)
        {
            var product = await _repo.GetByIdAsync(id);
            if (product == null)
                throw new KeyNotFoundException("Product not found.");
            if (!product.RowVersion.SequenceEqual(request.RowVersion))
                throw new DbUpdateConcurrencyException(
                    "The product was modified by another process."
                );

            if (await _repo.SkuExistsAsync(product.Sku, ignoreId: id))
                throw new InvalidOperationException("SKU already exists on another product.");
            product.Name = request.Name;
            product.Description = request.Description;
            product.BasePrice = request.BasePrice;
            product.CategoryId = request.CategoryId;
            product.UpdatedAt = DateTime.UtcNow;

            var existingVariants = product.Variants.ToList();

            foreach (var v in request.Variants)
            {
                if (v.Id.HasValue)
                {
                    var existing = existingVariants.FirstOrDefault(x => x.Id == v.Id.Value);

                    if (existing != null)
                    {
                        existing.Color = v.Color;
                        existing.Size = v.Size;
                        existing.AdditionalPrice = v.AdditionalPrice;
                        existing.StockQuantity = v.StockQuantity;
                        continue;
                    }
                }
                product.Variants.Add(new ProductVariant
                {
                    Color = v.Color,
                    Size = v.Size,
                    AdditionalPrice = v.AdditionalPrice,
                    StockQuantity = v.StockQuantity
                });
            }
            var removeVariants = existingVariants
                .Where(ev => !request.Variants.Any(v => v.Id == ev.Id))
                .ToList();

            foreach (var rv in removeVariants)
                _repo.RemoveVariant(rv);

            var existingImages = product.Images.ToList();

            for (int i = 0; i < request.ImageUrls.Count; i++)
            {
                var url = request.ImageUrls[i];

                if (i < existingImages.Count)
                {
                    existingImages[i].ImageUrl = url;
                    existingImages[i].IsPrimary = i == 0;
                }
                else
                {
                    product.Images.Add(new ProductImage
                    {
                        ImageUrl = url,
                        IsPrimary = i == 0
                    });
                }
            }

            var extraImages = existingImages
                .Skip(request.ImageUrls.Count)
                .ToList();

            foreach (var img in extraImages)
                _repo.RemoveImage(img);
            await _repo.UpdateAsync(product);
            await _repo.SaveChangesAsync();
        }



        public async Task DeleteAsync(Guid id)
        {
            var product = await _repo.GetByIdAsync(id);
            if (product == null)
                throw new KeyNotFoundException("Product not found.");

            await _repo.SoftDeleteAsync(product);
            await _repo.SaveChangesAsync();
        }

        private ProductResponse MapToResponse(Product product)
        {
            return new ProductResponse
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Sku = product.Sku,
                BasePrice = product.BasePrice,

                CategoryId = product.CategoryId,
                CategoryName = product.Category?.Name,

                IsActive = product.IsActive,
                CreatedAt = product.CreatedAt,
                UpdatedAt = product.UpdatedAt,

                RowVersion = product.RowVersion,

                Variants = product.Variants.Select(v => new ProductVariantResponse
                {
                    Id = v.Id,
                    Color = v.Color,
                    Size = v.Size,
                    AdditionalPrice = v.AdditionalPrice,
                    StockQuantity = v.StockQuantity
                }).ToList(),

                ImageUrls = product.Images
                    .OrderByDescending(img => img.IsPrimary) 
                    .Select(img => img.ImageUrl)
                    .ToList()
            };
        }

    }
}
