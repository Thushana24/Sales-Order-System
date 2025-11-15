using Microsoft.AspNetCore.Mvc;
using SalesOrderAPI.Application.DTOs;
using SalesOrderAPI.Application.Interfaces;

namespace SalesOrderAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SalesOrdersController : ControllerBase
    {
        private readonly ISalesOrderService _salesOrderService;

        public SalesOrdersController(ISalesOrderService salesOrderService)
        {
            _salesOrderService = salesOrderService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var salesOrders = await _salesOrderService.GetAllSalesOrdersAsync();
            return Ok(salesOrders);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var salesOrder = await _salesOrderService.GetSalesOrderByIdAsync(id);
            if (salesOrder == null)
                return NotFound();
            return Ok(salesOrder);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateSalesOrderDto createDto)
        {
            try
            {
                var salesOrder = await _salesOrderService.CreateSalesOrderAsync(createDto);
                return CreatedAtAction(nameof(GetById), new { id = salesOrder.SalesOrderId }, salesOrder);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateSalesOrderDto updateDto)
        {
            if (id != updateDto.SalesOrderId)
                return BadRequest("ID mismatch");

            try
            {
                var salesOrder = await _salesOrderService.UpdateSalesOrderAsync(updateDto);
                return Ok(salesOrder);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _salesOrderService.DeleteSalesOrderAsync(id);
            if (!result)
                return NotFound();
            return NoContent();
        }
    }
}