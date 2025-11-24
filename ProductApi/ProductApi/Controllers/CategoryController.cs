using Microsoft.AspNetCore.Mvc;
using ProductApi.DTOs;
using ProductApi.Services;
using Swashbuckle.AspNetCore.Annotations;

namespace ProductApi.Controllers
{
    [ApiController]
    [Route("api/categories")]
    [SwaggerTag("Category Management API")]
    public class CategoryController : ControllerBase
    {
        private readonly CategoryService _service;

        public CategoryController(CategoryService service)
        {
            _service = service;
        }

        // ---------------------------------------------------------
        // GET ALL CATEGORIES
        // ---------------------------------------------------------
        [HttpGet]
        [SwaggerOperation(
            Summary = "Get All Categories",
            Description = "Returns the list of active categories"
        )]
        public async Task<IActionResult> GetAll()
        {
            var result = await _service.GetAllAsync();
            return Ok(result);
        }

        // ---------------------------------------------------------
        // GET CATEGORY BY ID
        // ---------------------------------------------------------
        [HttpGet("{id:Guid}")]
        [SwaggerOperation(
            Summary = "Get Category by ID",
            Description = "Returns a single category by ID"
        )]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await _service.GetByIdAsync(id);
            return result == null ? NotFound() : Ok(result);
        }

        // ---------------------------------------------------------
        // CREATE CATEGORY
        // ---------------------------------------------------------
        [HttpPost]
        [SwaggerOperation(
            Summary = "Create Category",
            Description = "Create a new category"
        )]
        public async Task<IActionResult> Create([FromBody] CategoryCreateRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _service.CreateAsync(request);

            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        // ---------------------------------------------------------
        // UPDATE CATEGORY
        // ---------------------------------------------------------
        [HttpPut("{id:Guid}")]
        [SwaggerOperation(
            Summary = "Update Category",
            Description = "Update the name of an existing category"
        )]
        public async Task<IActionResult> Update(Guid id, [FromBody] CategoryUpdateRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var ok = await _service.UpdateAsync(id, request);
            return ok ? NoContent() : NotFound();
        }

        // ---------------------------------------------------------
        // DELETE CATEGORY
        // ---------------------------------------------------------
        [HttpDelete("{id:Guid}")]
        [SwaggerOperation(
            Summary = "Delete Category",
            Description = "Soft delete a category by setting IsActive = false"
        )]
        public async Task<IActionResult> Delete(Guid id)
        {
            var ok = await _service.DeleteAsync(id);
            return ok ? NoContent() : NotFound();
        }
    }
}
