using Microsoft.EntityFrameworkCore;
using SalesOrderAPI.Application.Interfaces;
using SalesOrderAPI.Domain.Entities;
using SalesOrderAPI.Infrastructure.Data;

namespace SalesOrderAPI.Infrastructure.Repositories
{
    public class ItemRepository : IItemRepository
    {
        private readonly AppDbContext _context;

        public ItemRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Item>> GetAllAsync()
        {
            return await _context.Items.ToListAsync();
        }

        public async Task<Item?> GetByIdAsync(int id)
        {
            return await _context.Items.FindAsync(id);
        }
    }
}