namespace SalesOrderAPI.Application.DTOs
{
    public class CreateSalesOrderDto
    {
        public int ClientId { get; set; }
        public string DeliveryAddress { get; set; } = string.Empty;
        public string DeliveryCity { get; set; } = string.Empty;
        public string DeliveryPostalCode { get; set; } = string.Empty;
        public string DeliveryCountry { get; set; } = string.Empty;
        public List<CreateSalesOrderDetailDto> OrderDetails { get; set; } = new List<CreateSalesOrderDetailDto>();
    }

    public class CreateSalesOrderDetailDto
    {
        public int ItemId { get; set; }
        public string Note { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal TaxRate { get; set; }
    }
}