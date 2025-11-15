using SalesOrderAPI.Domain.Entities;

namespace SalesOrderAPI.Application.Interfaces
{
    public interface ISalesOrderRepository
    {
        Task<IEnumerable<SalesOrder>> GetAllAsync();
        Task<SalesOrder?> GetByIdAsync(int id);
        Task<SalesOrder> CreateAsync(SalesOrder salesOrder);
        Task<SalesOrder> UpdateAsync(SalesOrder salesOrder);
        Task<bool> DeleteAsync(int id);
        Task<string> GenerateOrderNumberAsync();
    }
}