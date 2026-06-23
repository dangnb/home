using System;
using Microsoft.EntityFrameworkCore;
using TapHoa.Infrastructure.Data;

var dbContextOptions = new DbContextOptionsBuilder<AppDbContext>()
    .UseSqlite("Data Source=d:\\GIT\\HOME\\job_out\\workspace\\src\\bandoan\\TapHoa\\TapHoa.API\\taphoa.db")
    .Options;

using var dbContext = new AppDbContext(dbContextOptions);

var user = await dbContext.Users.Include(u => u.Roles).FirstOrDefaultAsync(u => u.Username == "admin");

if (user == null) {
    Console.WriteLine("User is NULL");
} else {
    Console.WriteLine($"User: {user.Username}, Hash: {user.PasswordHash}");
    bool verify = BCrypt.Net.BCrypt.Verify("admin123", user.PasswordHash);
    Console.WriteLine($"Verify admin123: {verify}");
}
