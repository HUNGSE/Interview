using Microsoft.EntityFrameworkCore;
using ProductApi.Data;
using ProductApi.Entities;

namespace ProductApi.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly AppDbContext _db;

        public ProductRepository(AppDbContext db)
        {
            _db = db;
        }

        public async Task<Product?> GetByIdAsync(Guid id)
        {
            return await _db.Products
                .Include(p => p.Category)
                .Include(p => p.Variants)
                .Include(p => p.Images)
                .FirstOrDefaultAsync(p => p.Id == id && p.IsActive);
        }

        public async Task<(List<Product> Items, int Total)> GetPagedAsync(
           string? search,
           Guid? categoryId,
           decimal? minPrice,
           decimal? maxPrice,
           int page,
           int pageSize)
        {
            var query = _db.Products
                .Where(p => p.IsActive)
                .Include(p => p.Category)
                .Include(p => p.Variants)
                .Include(p => p.Images)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(p =>
                    p.Name.Contains(search) ||
                    p.Sku.Contains(search)
                );
            }

            if (categoryId.HasValue)
            {
                query = query.Where(p => p.CategoryId == categoryId.Value);
            }

            if (minPrice.HasValue)
            {
                query = query.Where(p => p.BasePrice >= minPrice.Value);
            }

            if (maxPrice.HasValue)
            {
                query = query.Where(p => p.BasePrice <= maxPrice.Value);
            }

            var total = await query.CountAsync();

            var items = await query
                .OrderByDescending(p => p.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, total);
        }

        public async Task<bool> SkuExistsAsync(string sku, Guid? ignoreId = null)
        {
            var query = _db.Products.Where(p => p.Sku == sku && p.IsActive);
            if (ignoreId.HasValue)
            {
                query = query.Where(p => p.Id != ignoreId.Value);
            }

            return await query.AnyAsync();
        }

        public async Task AddAsync(Product product)
        {
            await _db.Products.AddAsync(product);
        }

        public Task UpdateAsync(Product product)
        {
            _db.Products.Update(product);
            return Task.CompletedTask;
        }

        public Task SoftDeleteAsync(Product product)
        {
            product.IsActive = false;
            product.UpdatedAt = DateTime.UtcNow;
            return Task.CompletedTask;
        }

        public async Task SaveChangesAsync()
        {
            await _db.SaveChangesAsync();
        }
        public void RemoveVariant(ProductVariant variant)
        {
            _db.ProductVariants.Remove(variant);
        }

        public void RemoveImage(ProductImage image)
        {
            _db.ProductImages.Remove(image);
        }
    }
}
