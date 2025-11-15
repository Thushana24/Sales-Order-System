namespace SalesOrderAPI.Application.DTOs
{
    public class SalesOrderDto
    {
        public int SalesOrderId { get; set; }
        public string OrderNumber { get; set; } = string.Empty;
        public DateTime OrderDate { get; set; }
        public int ClientId { get; set; }
        public string ClientName { get; set; } = string.Empty;
        public string DeliveryAddress { get; set; } = string.Empty;
        public string DeliveryCity { get; set; } = string.Empty;
        public string DeliveryPostalCode { get; set; } = string.Empty;
        public string DeliveryCountry { get; set; } = string.Empty;
        public decimal TotalExclAmount { get; set; }
        public decimal TotalTaxAmount { get; set; }
        public decimal TotalInclAmount { get; set; }
        public List<SalesOrderDetailDto> OrderDetails { get; set; } = new List<SalesOrderDetailDto>();
    }
}