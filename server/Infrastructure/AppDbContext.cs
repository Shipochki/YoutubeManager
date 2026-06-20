using Domain;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<Short> Shorts => Set<Short>();
    public DbSet<RecurringExpense> RecurringExpenses => Set<RecurringExpense>();
    public DbSet<ProjectExpense> ProjectExpenses => Set<ProjectExpense>();
    public DbSet<RevenueEntry> RevenueEntries => Set<RevenueEntry>();
    public DbSet<TimeLog> TimeLogs => Set<TimeLog>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(e =>
        {
            e.HasIndex(u => u.SupabaseId).IsUnique();
            e.Property(u => u.SupabaseId).HasMaxLength(128).IsRequired();
            e.Property(u => u.Email).HasMaxLength(256).IsRequired();
            e.Property(u => u.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
        });

        modelBuilder.Entity<Project>(e =>
        {
            e.Property(p => p.Title).HasMaxLength(256).IsRequired();
            e.Property(p => p.Status).HasConversion<string>().HasMaxLength(32);
            e.Property(p => p.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            e.Property(p => p.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");
            e.HasIndex(p => p.UserId);
            e.HasOne(p => p.User).WithMany(u => u.Projects)
                .HasForeignKey(p => p.UserId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Short>(e =>
        {
            e.Property(s => s.Title).HasMaxLength(256).IsRequired();
            e.Property(s => s.YoutubeUrl).HasMaxLength(512);
            e.Property(s => s.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            e.HasIndex(s => s.ProjectId);
            e.HasOne(s => s.Project).WithMany(p => p.Shorts)
                .HasForeignKey(s => s.ProjectId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<RecurringExpense>(e =>
        {
            e.Property(r => r.Name).HasMaxLength(256).IsRequired();
            e.Property(r => r.Category).HasMaxLength(128).IsRequired();
            e.Property(r => r.Amount).HasColumnType("decimal(18,4)");
            e.Property(r => r.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            e.HasIndex(r => r.UserId);
            e.HasOne(r => r.User).WithMany(u => u.RecurringExpenses)
                .HasForeignKey(r => r.UserId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<ProjectExpense>(e =>
        {
            e.Property(pe => pe.Description).HasMaxLength(512).IsRequired();
            e.Property(pe => pe.Category).HasMaxLength(128).IsRequired();
            e.Property(pe => pe.Amount).HasColumnType("decimal(18,4)");
            e.Property(pe => pe.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            e.HasIndex(pe => pe.ProjectId);
            e.HasOne(pe => pe.Project).WithMany(p => p.Expenses)
                .HasForeignKey(pe => pe.ProjectId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<RevenueEntry>(e =>
        {
            e.Property(r => r.Source).HasMaxLength(256).IsRequired();
            e.Property(r => r.Amount).HasColumnType("decimal(18,4)");
            e.Property(r => r.Notes).HasMaxLength(1024);
            e.Property(r => r.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            e.HasIndex(r => r.ProjectId);
            e.HasOne(r => r.Project).WithMany(p => p.RevenueEntries)
                .HasForeignKey(r => r.ProjectId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<TimeLog>(e =>
        {
            e.Property(t => t.Category).HasMaxLength(128).IsRequired();
            e.Property(t => t.Hours).HasColumnType("decimal(10,2)");
            e.Property(t => t.Notes).HasMaxLength(1024);
            e.Property(t => t.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            e.HasIndex(t => t.ProjectId);
            e.HasOne(t => t.Project).WithMany(p => p.TimeLogs)
                .HasForeignKey(t => t.ProjectId).OnDelete(DeleteBehavior.Cascade);
        });
    }
}
