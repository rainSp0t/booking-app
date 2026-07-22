using BookingApp.Models;
using Microsoft.EntityFrameworkCore;

namespace BookingApp.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }


    public DbSet<User> Users { get; set; } = null!;

    public DbSet<Venue> Venues { get; set; } = null!;

    public DbSet<Court> Courts { get; set; } = null!;

    public DbSet<Booking> Bookings { get; set; } = null!;

    public DbSet<OpeningHours> OpeningHours { get; set; } = null!;


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);


        modelBuilder.Entity<Booking>()
            .HasOne(b => b.User)
            .WithMany()
            .HasForeignKey(b => b.UserId)
            .OnDelete(DeleteBehavior.NoAction);


        modelBuilder.Entity<Booking>()
            .HasOne(b => b.Court)
            .WithMany(c => c.Bookings)
            .HasForeignKey(b => b.CourtId)
            .OnDelete(DeleteBehavior.NoAction);
    }
}