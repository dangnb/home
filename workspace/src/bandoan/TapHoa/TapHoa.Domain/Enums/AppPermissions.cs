namespace TapHoa.Domain.Enums;

public static class AppPermissions
{
    // Users
    public const string ViewUsers = "Permissions.Users.View";
    public const string CreateUsers = "Permissions.Users.Create";
    public const string UpdateUsers = "Permissions.Users.Update";
    public const string DeleteUsers = "Permissions.Users.Delete";
    
    // Roles
    public const string ViewRoles = "Permissions.Roles.View";
    public const string CreateRoles = "Permissions.Roles.Create";
    public const string UpdateRoles = "Permissions.Roles.Update";
    public const string DeleteRoles = "Permissions.Roles.Delete";
    
    // Products & Categories
    public const string ViewProducts = "Permissions.Products.View";
    public const string CreateProducts = "Permissions.Products.Create";
    public const string UpdateProducts = "Permissions.Products.Update";
    public const string DeleteProducts = "Permissions.Products.Delete";
    
    public const string ViewCategories = "Permissions.Categories.View";
    public const string CreateCategories = "Permissions.Categories.Create";
    public const string UpdateCategories = "Permissions.Categories.Update";
    public const string DeleteCategories = "Permissions.Categories.Delete";

    // HR (Employees, Departments, Positions)
    public const string ViewHR = "Permissions.HR.View";
    public const string CreateHR = "Permissions.HR.Create";
    public const string UpdateHR = "Permissions.HR.Update";
    public const string DeleteHR = "Permissions.HR.Delete";

    // Inventory & Transactions
    public const string ViewInventory = "Permissions.Inventory.View";
    public const string CreateInventory = "Permissions.Inventory.Create";
    public const string UpdateInventory = "Permissions.Inventory.Update";
    public const string DeleteInventory = "Permissions.Inventory.Delete";

    // Customers & Suppliers
    public const string ViewCustomers = "Permissions.Customers.View";
    public const string CreateCustomers = "Permissions.Customers.Create";
    public const string UpdateCustomers = "Permissions.Customers.Update";
    public const string DeleteCustomers = "Permissions.Customers.Delete";

    public const string ViewSuppliers = "Permissions.Suppliers.View";
    public const string CreateSuppliers = "Permissions.Suppliers.Create";
    public const string UpdateSuppliers = "Permissions.Suppliers.Update";
    public const string DeleteSuppliers = "Permissions.Suppliers.Delete";

    // Payroll
    public const string ViewPayroll = "Permissions.Payroll.View";
    public const string ManagePayroll = "Permissions.Payroll.Manage";

    // POS & Orders
    public const string ViewPOS = "Permissions.POS.View";
    public const string CreateOrderPOS = "Permissions.POS.CreateOrder";
    public const string ViewOrders = "Permissions.Orders.View";

    // Reports
    public const string ViewReports = "Permissions.Reports.View";

    // Helper to get all permissions
    public static List<string> GetAll()
    {
        return typeof(AppPermissions)
            .GetFields(System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.Static | System.Reflection.BindingFlags.FlattenHierarchy)
            .Where(fi => fi.IsLiteral && !fi.IsInitOnly && fi.FieldType == typeof(string))
            .Select(x => (string)x.GetRawConstantValue()!)
            .ToList();
    }
}
