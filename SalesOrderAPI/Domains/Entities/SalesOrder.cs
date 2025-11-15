using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SalesOrderAPI.Domain.Entities
{
    [Table("SalesOrder")]
    public class SalesOrder
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int SalesOrderId { get; set; }

        [Required]
        [StringLength(50)]
        public string OrderNumber { get; set; } = string.Empty;

        [Required]
        public DateTime OrderDate { get; set; } = DateTime.Now;

        [Required]
        public int ClientId { get; set; }

        [StringLength(500)]
        public string DeliveryAddress { get; set; } = string.Empty;

        [StringLength(100)]
        public string DeliveryCity { get; set; } = string.Empty;

        [StringLength(20)]
        public string DeliveryPostalCode { get; set; } = string.Empty;

        [StringLength(100)]
        public string DeliveryCountry { get; set; } = string.Empty;

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalExclAmount { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalTaxAmount { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalInclAmount { get; set; }

        // Navigation properties
        [ForeignKey("ClientId")]
        public virtual Client Client { get; set; } = null!;

        public virtual ICollection<SalesOrderDetail> SalesOrderDetails { get; set; } = new List<SalesOrderDetail>();
    }
}