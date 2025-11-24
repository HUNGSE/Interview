using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProductApi.DTOs;
using ProductApi.Services;
using Swashbuckle.AspNetCore.Annotations;

namespace ProductApi.Controllers
{
    [ApiController]
    [Route("api/products")]
    public class ProductsController : ControllerBase
    {
        private readonly ProductService _service;

        public ProductsController(ProductService service)
        {
            _service = service;
        }

        // ---------------------------------------------------------
        // CREATE PRODUCT
        // ---------------------------------------------------------
        [HttpPost]
        [SwaggerOperation(
            Summary = "Create Product",
            Description = "Create a new product including variants and images"
        )]
        public async Task<IActionResult> Create([FromBody] ProductCreateRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var result = await _service.CreateAsync(request);
                return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }


        // ---------------------------------------------------------
        // GET PRODUCT BY ID
        // ---------------------------------------------------------
        [HttpGet("{id:Guid}")]
        [SwaggerOperation(
            Summary = "Get Product by ID",
            Description = "Return a single product including variants, category, and images"
        )]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await _service.GetByIdAsync(id);
            if (result == null)
                return NotFound();

            return Ok(result);
        }


        // ---------------------------------------------------------
        // GET PRODUCTS WITH PAGINATION + FILTERS
        // ---------------------------------------------------------
        [HttpGet]
        [SwaggerOperation(
            Summary = "Get Products (Pagination + Filters)",
            Description = "Get a paginated list of products with search, filtering and sorting"
        )]
        public async Task<IActionResult> GetPaged(
            [FromQuery] string? search,
            [FromQuery] Guid? categoryId,
            [FromQuery] decimal? minPrice,
            [FromQuery] decimal? maxPrice,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            page = page < 1 ? 1 : page;
            pageSize = pageSize <= 0 ? 20 : Math.Min(pageSize, 100);

            var (items, total) = await _service.GetPagedAsync(search, categoryId, minPrice, maxPrice, page, pageSize);

            return Ok(new
            {
                items,
                total,
                page,
                pageSize,
                totalPages = (int)Math.Ceiling(total / (double)pageSize)
            });
        }


        // ---------------------------------------------------------
        // UPDATE PRODUCT
        // ---------------------------------------------------------
        [HttpPut("{id:Guid}")]
        [SwaggerOperation(
            Summary = "Update Product",
            Description = "Update an existing product including variants and images"
        )]
        public async Task<IActionResult> Update(Guid id, [FromBody] ProductUpdateRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                await _service.UpdateAsync(id, request);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                return Conflict(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }


        // ---------------------------------------------------------
        // DELETE PRODUCT (SOFT DELETE)
        // ---------------------------------------------------------
        [HttpDelete("{id:Guid}")]
        [SwaggerOperation(
            Summary = "Delete Product",
            Description = "Soft delete a product by marking it inactive"
        )]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                await _service.DeleteAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }
    }
}
