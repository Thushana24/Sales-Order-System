using SalesOrderAPI.Application.DTOs;

namespace SalesOrderAPI.Application.Interfaces
{
    public interface IItemService
    {
        Task<IEnumerable<ItemDto>> GetAllItemsAsync();
        Task<ItemDto?> GetItemByIdAsync(int id);
    }
}