using SalesOrderAPI.Application.DTOs;
using SalesOrderAPI.Application.Interfaces;
using SalesOrderAPI.Domain.Entities;

namespace SalesOrderAPI.Application.Services
{
    public class SalesOrderService : ISalesOrderService
    {
        private readonly ISalesOrderRepository _salesOrderRepository;
        private readonly IItemRepository _itemRepository;

        public SalesOrderService(ISalesOrderRepository salesOrderRepository, IItemRepository itemRepository)
        {
            _salesOrderRepository = salesOrderRepository;
            _itemRepository = itemRepository;
        }

        public async Task<IEnumerable<SalesOrderDto>> GetAllSalesOrdersAsync()
        {
            var salesOrders = await _salesOrderRepository.GetAllAsync();
            return salesOrders.Select(MapToDto);
        }

        public async Task<SalesOrderDto?> GetSalesOrderByIdAsync(int id)
        {
            var salesOrder = await _salesOrderRepository.GetByIdAsync(id);
            return salesOrder == null ? null : MapToDto(salesOrder);
        }

        public async Task<SalesOrderDto> CreateSalesOrderAsync(CreateSalesOrderDto createDto)
        {
            var orderNumber = await _salesOrderRepository.GenerateOrderNumberAsync();

            var salesOrder = new SalesOrder
            {
                OrderNumber = orderNumber,
                OrderDate = DateTime.Now,
                ClientId = createDto.ClientId,
                DeliveryAddress = createDto.DeliveryAddress,
                DeliveryCity = createDto.DeliveryCity,
                DeliveryPostalCode = createDto.DeliveryPostalCode,
                DeliveryCountry = createDto.DeliveryCountry,
                SalesOrderDetails = new List<SalesOrderDetail>()
            };

            decimal totalExcl = 0;
            decimal totalTax = 0;
            decimal totalIncl = 0;

            foreach (var detailDto in createDto.OrderDetails)
            {
                var item = await _itemRepository.GetByIdAsync(detailDto.ItemId);
                if (item == null) continue;

                var exclAmount = detailDto.Quantity * item.UnitPrice;
                var taxAmount = exclAmount * detailDto.TaxRate / 100;
                var inclAmount = exclAmount + taxAmount;

                var detail = new SalesOrderDetail
                {
                    ItemId = detailDto.ItemId,
                    Note = detailDto.Note,
                    Quantity = detailDto.Quantity,
                    UnitPrice = item.UnitPrice,
                    TaxRate = detailDto.TaxRate,
                    ExclAmount = exclAmount,
                    TaxAmount = taxAmount,
                    InclAmount = inclAmount
                };

                salesOrder.SalesOrderDetails.Add(detail);

                totalExcl += exclAmount;
                totalTax += taxAmount;
                totalIncl += inclAmount;
            }

            salesOrder.TotalExclAmount = totalExcl;
            salesOrder.TotalTaxAmount = totalTax;
            salesOrder.TotalInclAmount = totalIncl;

            var createdOrder = await _salesOrderRepository.CreateAsync(salesOrder);
            var result = await _salesOrderRepository.GetByIdAsync(createdOrder.SalesOrderId);
            return MapToDto(result!);
        }

        public async Task<SalesOrderDto> UpdateSalesOrderAsync(UpdateSalesOrderDto updateDto)
        {
            var existingOrder = await _salesOrderRepository.GetByIdAsync(updateDto.SalesOrderId);
            if (existingOrder == null)
                throw new Exception("Sales order not found");

            existingOrder.ClientId = updateDto.ClientId;
            existingOrder.DeliveryAddress = updateDto.DeliveryAddress;
            existingOrder.DeliveryCity = updateDto.DeliveryCity;
            existingOrder.DeliveryPostalCode = updateDto.DeliveryPostalCode;
            existingOrder.DeliveryCountry = updateDto.DeliveryCountry;
            existingOrder.SalesOrderDetails = new List<SalesOrderDetail>();

            decimal totalExcl = 0;
            decimal totalTax = 0;
            decimal totalIncl = 0;

            foreach (var detailDto in updateDto.OrderDetails)
            {
                var item = await _itemRepository.GetByIdAsync(detailDto.ItemId);
                if (item == null) continue;

                var exclAmount = detailDto.Quantity * item.UnitPrice;
                var taxAmount = exclAmount * detailDto.TaxRate / 100;
                var inclAmount = exclAmount + taxAmount;

                var detail = new SalesOrderDetail
                {
                    SalesOrderDetailId = detailDto.SalesOrderDetailId,
                    SalesOrderId = updateDto.SalesOrderId,
                    ItemId = detailDto.ItemId,
                    Note = detailDto.Note,
                    Quantity = detailDto.Quantity,
                    UnitPrice = item.UnitPrice,
                    TaxRate = detailDto.TaxRate,
                    ExclAmount = exclAmount,
                    TaxAmount = taxAmount,
                    InclAmount = inclAmount
                };

                existingOrder.SalesOrderDetails.Add(detail);

                totalExcl += exclAmount;
                totalTax += taxAmount;
                totalIncl += inclAmount;
            }

            existingOrder.TotalExclAmount = totalExcl;
            existingOrder.TotalTaxAmount = totalTax;
            existingOrder.TotalInclAmount = totalIncl;

            var updatedOrder = await _salesOrderRepository.UpdateAsync(existingOrder);
            var result = await _salesOrderRepository.GetByIdAsync(updatedOrder.SalesOrderId);
            return MapToDto(result!);
        }

        public async Task<bool> DeleteSalesOrderAsync(int id)
        {
            return await _salesOrderRepository.DeleteAsync(id);
        }

        private SalesOrderDto MapToDto(SalesOrder salesOrder)
        {
            return new SalesOrderDto
            {
                SalesOrderId = salesOrder.SalesOrderId,
                OrderNumber = salesOrder.OrderNumber,
                OrderDate = salesOrder.OrderDate,
                ClientId = salesOrder.ClientId,
                ClientName = salesOrder.Client?.ClientName ?? "",
                DeliveryAddress = salesOrder.DeliveryAddress,
                DeliveryCity = salesOrder.DeliveryCity,
                DeliveryPostalCode = salesOrder.DeliveryPostalCode,
                DeliveryCountry = salesOrder.DeliveryCountry,
                TotalExclAmount = salesOrder.TotalExclAmount,
                TotalTaxAmount = salesOrder.TotalTaxAmount,
                TotalInclAmount = salesOrder.TotalInclAmount,
                OrderDetails = salesOrder.SalesOrderDetails.Select(d => new SalesOrderDetailDto
                {
                    SalesOrderDetailId = d.SalesOrderDetailId,
                    SalesOrderId = d.SalesOrderId,
                    ItemId = d.ItemId,
                    ItemCode = d.Item?.ItemCode ?? "",
                    ItemDescription = d.Item?.Description ?? "",
                    Note = d.Note,
                    Quantity = d.Quantity,
                    UnitPrice = d.UnitPrice,
                    TaxRate = d.TaxRate,
                    ExclAmount = d.ExclAmount,
                    TaxAmount = d.TaxAmount,
                    InclAmount = d.InclAmount
                }).ToList()
            };
        }
    }
}