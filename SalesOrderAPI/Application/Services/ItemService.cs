using SalesOrderAPI.Application.DTOs;
using SalesOrderAPI.Application.Interfaces;

namespace SalesOrderAPI.Application.Services
{
    public class ItemService : IItemService
    {
        private readonly IItemRepository _itemRepository;

        public ItemService(IItemRepository itemRepository)
        {
            _itemRepository = itemRepository;
        }

        public async Task<IEnumerable<ItemDto>> GetAllItemsAsync()
        {
            var items = await _itemRepository.GetAllAsync();
            return items.Select(i => new ItemDto
            {
                ItemId = i.ItemId,
                ItemCode = i.ItemCode,
                Description = i.Description,
                UnitPrice = i.UnitPrice
            });
        }

        public async Task<ItemDto?> GetItemByIdAsync(int id)
        {
            var item = await _itemRepository.GetByIdAsync(id);
            if (item == null) return null;

            return new ItemDto
            {
                ItemId = item.ItemId,
                ItemCode = item.ItemCode,
                Description = item.Description,
                UnitPrice = item.UnitPrice
            };
        }
    }
}
