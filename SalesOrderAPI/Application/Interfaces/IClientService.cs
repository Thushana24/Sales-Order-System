using SalesOrderAPI.Application.DTOs;

namespace SalesOrderAPI.Application.Interfaces
{
    public interface IClientService
    {
        Task<IEnumerable<ClientDto>> GetAllClientsAsync();
        Task<ClientDto?> GetClientByIdAsync(int id);
    }
}