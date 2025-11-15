using SalesOrderAPI.Application.DTOs;

namespace SalesOrderAPI.Application.Interfaces
{
    public interface ISalesOrderService
    {
        Task<IEnumerable<SalesOrderDto>> GetAllSalesOrdersAsync();
        Task<SalesOrderDto?> GetSalesOrderByIdAsync(int id);
        Task<SalesOrderDto> CreateSalesOrderAsync(CreateSalesOrderDto createDto);
        Task<SalesOrderDto> UpdateSalesOrderAsync(UpdateSalesOrderDto updateDto);
        Task<bool> DeleteSalesOrderAsync(int id);
    }
}