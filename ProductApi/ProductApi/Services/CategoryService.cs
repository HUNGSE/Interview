using ProductApi.DTOs;
using ProductApi.Entities;
using ProductApi.Repositories;

namespace ProductApi.Services
{
    public class CategoryService
    {
        private readonly ICategoryRepository _repo;

        public CategoryService(ICategoryRepository repo)
        {
            _repo = repo;
        }

        public async Task<CategoryResponse?> GetByIdAsync(Guid id)
        {
            var cat = await _repo.GetByIdAsync(id);
            return cat == null ? null : new CategoryResponse
            {
                Id = cat.Id,
                Name = cat.Name
            };
        }

        public async Task<List<CategoryResponse>> GetAllAsync()
        {
            var list = await _repo.GetAllAsync();
            return list.Select(c => new CategoryResponse
            {
                Id = c.Id,
                Name = c.Name
            }).ToList();
        }

        public async Task<CategoryResponse> CreateAsync(CategoryCreateRequest req)
        {
            var cat = new Category { Name = req.Name };
            await _repo.CreateAsync(cat);

            return new CategoryResponse
            {
                Id = cat.Id,
                Name = cat.Name
            };
        }

        public async Task<bool> UpdateAsync(Guid id, CategoryUpdateRequest req)
        {
            var cat = await _repo.GetByIdAsync(id);
            if (cat == null) return false;

            cat.Name = req.Name;
            await _repo.UpdateAsync(cat);
            return true;
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var cat = await _repo.GetByIdAsync(id);
            if (cat == null) return false;

            await _repo.DeleteAsync(cat);
            return true;
        }
    }
}
