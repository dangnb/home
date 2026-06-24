using System;
using TapHoa.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
optionsBuilder.UseSqlite(""Data Source=taphoa.db"");
var context = new AppDbContext(optionsBuilder.Options);
try {
    context.Database.EnsureCreated();
} catch (Exception ex) {
    Console.WriteLine(""### EF CORE CRASH ###"");
    Console.WriteLine(ex.ToString());
    System.IO.File.WriteAllText(""ef_crash.txt"", ex.ToString());
}
