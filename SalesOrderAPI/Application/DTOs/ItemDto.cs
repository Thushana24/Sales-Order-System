namespace SalesOrderAPI.Application.DTOs
{
    public class ItemDto
    {
        public int ItemId { get; set; }
        public string ItemCode { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal UnitPrice { get; set; }
    }
}