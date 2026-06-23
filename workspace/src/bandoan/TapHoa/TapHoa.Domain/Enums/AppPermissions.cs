namespace TapHoa.Domain.Enums;

[Flags]
public enum AppPermissions : long
{
    None = 0,
    
    // Users (1-15)
    ViewUsers = 1L << 0,
    CreateUsers = 1L << 1,
    UpdateUsers = 1L << 2,
    DeleteUsers = 1L << 3,
    AssignRoles = 1L << 4,
    
    // Roles (16-31)
    ViewRoles = 1L << 10,
    CreateRoles = 1L << 11,
    UpdateRoles = 1L << 12,
    DeleteRoles = 1L << 13,
    
    // Products & Categories (32-47)
    ViewProducts = 1L << 20,
    CreateProducts = 1L << 21,
    UpdateProducts = 1L << 22,
    DeleteProducts = 1L << 23,
    ViewCategories = 1L << 24,
    CreateCategories = 1L << 25,
    UpdateCategories = 1L << 26,
    DeleteCategories = 1L << 27,
    
    // Admin Master Profile
    All = ~0L
}
