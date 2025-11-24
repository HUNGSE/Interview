namespace ProductApi.Entities
{
    public class Category
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public string Name { get; set; }

        public bool IsActive { get; set; } = true;

        public List<Product> Products { get; set; } = new();
    }
}
