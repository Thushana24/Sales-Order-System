using SalesOrderAPI.Domain.Entities;

namespace SalesOrderAPI.Application.Interfaces
{
    public interface IItemRepository
    {
        Task<IEnumerable<Item>> GetAllAsync();
        Task<Item?> GetByIdAsync(int id);
    }
}