using System;

string hash = "$2a$11$90Xb.I39c65h/T9qWn.2IuTksr6Kx7Oa6Jt4i57l.P6z0uLWe21M6";
bool verifyAdmin123 = BCrypt.Net.BCrypt.Verify("admin123", hash);
Console.WriteLine($"Verify admin123: {verifyAdmin123}");

// Also let's print a new hash for admin123
string newHash = BCrypt.Net.BCrypt.HashPassword("admin123");
Console.WriteLine($"New hash: {newHash}");
Console.WriteLine($"Verify new hash with admin123: {BCrypt.Net.BCrypt.Verify("admin123", newHash)}");
