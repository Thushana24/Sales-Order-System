using Microsoft.EntityFrameworkCore;
using SalesOrderAPI.Domain.Entities;

namespace SalesOrderAPI.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Client> Clients { get; set; }
        public DbSet<Item> Items { get; set; }
        public DbSet<SalesOrder> SalesOrders { get; set; }
        public DbSet<SalesOrderDetail> SalesOrderDetails { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure relationships
            modelBuilder.Entity<SalesOrder>()
                .HasOne(so => so.Client)
                .WithMany(c => c.SalesOrders)
                .HasForeignKey(so => so.ClientId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<SalesOrderDetail>()
                .HasOne(sod => sod.SalesOrder)
                .WithMany(so => so.SalesOrderDetails)
                .HasForeignKey(sod => sod.SalesOrderId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<SalesOrderDetail>()
                .HasOne(sod => sod.Item)
                .WithMany(i => i.SalesOrderDetails)
                .HasForeignKey(sod => sod.ItemId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure decimal precision
            modelBuilder.Entity<Item>()
                .Property(i => i.UnitPrice)
                .HasPrecision(18, 2);

            modelBuilder.Entity<SalesOrder>()
                .Property(so => so.TotalExclAmount)
                .HasPrecision(18, 2);

            modelBuilder.Entity<SalesOrder>()
                .Property(so => so.TotalTaxAmount)
                .HasPrecision(18, 2);

            modelBuilder.Entity<SalesOrder>()
                .Property(so => so.TotalInclAmount)
                .HasPrecision(18, 2);

            modelBuilder.Entity<SalesOrderDetail>()
                .Property(sod => sod.UnitPrice)
                .HasPrecision(18, 2);

            modelBuilder.Entity<SalesOrderDetail>()
                .Property(sod => sod.TaxRate)
                .HasPrecision(5, 2);

            modelBuilder.Entity<SalesOrderDetail>()
                .Property(sod => sod.ExclAmount)
                .HasPrecision(18, 2);

            modelBuilder.Entity<SalesOrderDetail>()
                .Property(sod => sod.TaxAmount)
                .HasPrecision(18, 2);

            modelBuilder.Entity<SalesOrderDetail>()
                .Property(sod => sod.InclAmount)
                .HasPrecision(18, 2);
        }
    }
}