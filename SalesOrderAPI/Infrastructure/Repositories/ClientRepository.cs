using Microsoft.EntityFrameworkCore;
using SalesOrderAPI.Application.Interfaces;
using SalesOrderAPI.Domain.Entities;
using SalesOrderAPI.Infrastructure.Data;

namespace SalesOrderAPI.Infrastructure.Repositories
{
    public class ClientRepository : IClientRepository
    {
        private readonly AppDbContext _context;

        public ClientRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Client>> GetAllAsync()
        {
            return await _context.Clients.ToListAsync();
        }

        public async Task<Client?> GetByIdAsync(int id)
        {
            return await _context.Clients.FindAsync(id);
        }
    }
}
