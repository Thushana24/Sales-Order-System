using Microsoft.EntityFrameworkCore;
using SalesOrderAPI.Application.Interfaces;
using SalesOrderAPI.Domain.Entities;
using SalesOrderAPI.Infrastructure.Data;

namespace SalesOrderAPI.Infrastructure.Repositories
{
    public class SalesOrderRepository : ISalesOrderRepository
    {
        private readonly AppDbContext _context;

        public SalesOrderRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<SalesOrder>> GetAllAsync()
        {
            return await _context.SalesOrders
                .Include(so => so.Client)
                .Include(so => so.SalesOrderDetails)
                    .ThenInclude(sod => sod.Item)
                .OrderByDescending(so => so.OrderDate)
                .ToListAsync();
        }

        public async Task<SalesOrder?> GetByIdAsync(int id)
        {
            return await _context.SalesOrders
                .Include(so => so.Client)
                .Include(so => so.SalesOrderDetails)
                    .ThenInclude(sod => sod.Item)
                .FirstOrDefaultAsync(so => so.SalesOrderId == id);
        }

        public async Task<SalesOrder> CreateAsync(SalesOrder salesOrder)
        {
            _context.SalesOrders.Add(salesOrder);
            await _context.SaveChangesAsync();
            return salesOrder;
        }

        public async Task<SalesOrder> UpdateAsync(SalesOrder salesOrder)
        {
            _context.Entry(salesOrder).State = EntityState.Modified;

            // Remove old details
            var existingDetails = _context.SalesOrderDetails
                .Where(d => d.SalesOrderId == salesOrder.SalesOrderId);
            _context.SalesOrderDetails.RemoveRange(existingDetails);

            // Add new details
            foreach (var detail in salesOrder.SalesOrderDetails)
            {
                _context.SalesOrderDetails.Add(detail);
            }

            await _context.SaveChangesAsync();
            return salesOrder;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var salesOrder = await _context.SalesOrders.FindAsync(id);
            if (salesOrder == null)
                return false;

            _context.SalesOrders.Remove(salesOrder);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<string> GenerateOrderNumberAsync()
        {
            var lastOrder = await _context.SalesOrders
                .OrderByDescending(so => so.SalesOrderId)
                .FirstOrDefaultAsync();

            var nextNumber = lastOrder != null
                ? int.Parse(lastOrder.OrderNumber.Replace("SO", "")) + 1
                : 1;

            return $"SO{nextNumber:D6}";
        }
    }
}