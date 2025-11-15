using SalesOrderAPI.Application.DTOs;
using SalesOrderAPI.Application.Interfaces;

namespace SalesOrderAPI.Application.Services
{
    public class ClientService : IClientService
    {
        private readonly IClientRepository _clientRepository;

        public ClientService(IClientRepository clientRepository)
        {
            _clientRepository = clientRepository;
        }

        public async Task<IEnumerable<ClientDto>> GetAllClientsAsync()
        {
            var clients = await _clientRepository.GetAllAsync();
            return clients.Select(c => new ClientDto
            {
                ClientId = c.ClientId,
                ClientName = c.ClientName,
                Address = c.Address,
                City = c.City,
                PostalCode = c.PostalCode,
                Country = c.Country
            });
        }

        public async Task<ClientDto?> GetClientByIdAsync(int id)
        {
            var client = await _clientRepository.GetByIdAsync(id);
            if (client == null) return null;

            return new ClientDto
            {
                ClientId = client.ClientId,
                ClientName = client.ClientName,
                Address = client.Address,
                City = client.City,
                PostalCode = client.PostalCode,
                Country = client.Country
            };
        }
    }
}