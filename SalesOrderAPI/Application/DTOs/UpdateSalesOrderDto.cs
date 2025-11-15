namespace SalesOrderAPI.Application.DTOs
{
    public class UpdateSalesOrderDto
    {
        public int SalesOrderId { get; set; }
        public int ClientId { get; set; }
        public string DeliveryAddress { get; set; } = string.Empty;
        public string DeliveryCity { get; set; } = string.Empty;
        public string DeliveryPostalCode { get; set; } = string.Empty;
        public string DeliveryCountry { get; set; } = string.Empty;
        public List<UpdateSalesOrderDetailDto> OrderDetails { get; set; } = new List<UpdateSalesOrderDetailDto>();
    }

    public class UpdateSalesOrderDetailDto
    {
        public int SalesOrderDetailId { get; set; }
        public int ItemId { get; set; }
        public string Note { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal TaxRate { get; set; }
    }
}