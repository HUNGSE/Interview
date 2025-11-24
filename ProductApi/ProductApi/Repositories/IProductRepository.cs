using ProductApi.Entities;

namespace ProductApi.Repositories
{
    using ProductApi.Entities;

    public interface IProductRepository
    {
        Task<Product?> GetByIdAsync(Guid id);

        Task<(List<Product> Items, int Total)> GetPagedAsync(
            string? search,
            Guid? categoryId,
            decimal? minPrice,
            decimal? maxPrice,
            int page,
            int pageSize);

        Task<bool> SkuExistsAsync(string sku, Guid? ignoreId = null);

        Task AddAsync(Product product);
        Task UpdateAsync(Product product);
        Task SoftDeleteAsync(Product product);

        void RemoveVariant(ProductVariant variant);
        void RemoveImage(ProductImage image);

        Task SaveChangesAsync();
    }

}
