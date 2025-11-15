using SalesOrderAPI.Domain.Entities;

namespace SalesOrderAPI.Application.Interfaces
{
    public interface IClientRepository
    {
        Task<IEnumerable<Client>> GetAllAsync();
        Task<Client?> GetByIdAsync(int id);
    }
}