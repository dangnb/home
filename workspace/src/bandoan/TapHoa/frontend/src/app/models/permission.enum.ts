export const AppPermissions = {
    // Users
    ViewUsers: 'Permissions.Users.View',
    CreateUsers: 'Permissions.Users.Create',
    UpdateUsers: 'Permissions.Users.Update',
    DeleteUsers: 'Permissions.Users.Delete',
    
    // Roles
    ViewRoles: 'Permissions.Roles.View',
    CreateRoles: 'Permissions.Roles.Create',
    UpdateRoles: 'Permissions.Roles.Update',
    DeleteRoles: 'Permissions.Roles.Delete',
    
    // Products & Categories
    ViewProducts: 'Permissions.Products.View',
    CreateProducts: 'Permissions.Products.Create',
    UpdateProducts: 'Permissions.Products.Update',
    DeleteProducts: 'Permissions.Products.Delete',
    
    ViewCategories: 'Permissions.Categories.View',
    CreateCategories: 'Permissions.Categories.Create',
    UpdateCategories: 'Permissions.Categories.Update',
    DeleteCategories: 'Permissions.Categories.Delete',

    // HR
    ViewHR: 'Permissions.HR.View',
    CreateHR: 'Permissions.HR.Create',
    UpdateHR: 'Permissions.HR.Update',
    DeleteHR: 'Permissions.HR.Delete',

    // Inventory
    ViewInventory: 'Permissions.Inventory.View',
    CreateInventory: 'Permissions.Inventory.Create',
    UpdateInventory: 'Permissions.Inventory.Update',
    DeleteInventory: 'Permissions.Inventory.Delete',

    // Customers & Suppliers
    ViewCustomers: 'Permissions.Customers.View',
    CreateCustomers: 'Permissions.Customers.Create',
    UpdateCustomers: 'Permissions.Customers.Update',
    DeleteCustomers: 'Permissions.Customers.Delete',

    ViewSuppliers: 'Permissions.Suppliers.View',
    CreateSuppliers: 'Permissions.Suppliers.Create',
    UpdateSuppliers: 'Permissions.Suppliers.Update',
    DeleteSuppliers: 'Permissions.Suppliers.Delete',

    // Payroll
    ViewPayroll: 'Permissions.Payroll.View',
    ManagePayroll: 'Permissions.Payroll.Manage',

    // POS & Orders
    ViewPOS: 'Permissions.POS.View',
    CreateOrderPOS: 'Permissions.POS.CreateOrder',
    ViewOrders: 'Permissions.Orders.View',

    // Reports
    ViewReports: 'Permissions.Reports.View'
};

export const AppPermissionsList = [
    {
        group: 'Sản phẩm', items: [
            { name: 'ViewProducts', label: 'Xem Sản Phẩm', value: AppPermissions.ViewProducts },
            { name: 'CreateProducts', label: 'Tạo Sản Phẩm', value: AppPermissions.CreateProducts },
            { name: 'UpdateProducts', label: 'Cập nhật Sản Phẩm', value: AppPermissions.UpdateProducts },
            { name: 'DeleteProducts', label: 'Xóa Sản Phẩm', value: AppPermissions.DeleteProducts }
        ]
    },
    {
        group: 'Danh mục', items: [
            { name: 'ViewCategories', label: 'Xem Danh Mục', value: AppPermissions.ViewCategories },
            { name: 'CreateCategories', label: 'Tạo Danh Mục', value: AppPermissions.CreateCategories },
            { name: 'UpdateCategories', label: 'Cập nhật Danh Mục', value: AppPermissions.UpdateCategories },
            { name: 'DeleteCategories', label: 'Xóa Danh Mục', value: AppPermissions.DeleteCategories }
        ]
    },
    {
        group: 'Nhân sự', items: [
            { name: 'ViewHR', label: 'Xem Nhân sự', value: AppPermissions.ViewHR },
            { name: 'CreateHR', label: 'Thêm Nhân sự', value: AppPermissions.CreateHR },
            { name: 'UpdateHR', label: 'Cập nhật Nhân sự', value: AppPermissions.UpdateHR },
            { name: 'DeleteHR', label: 'Xóa Nhân sự', value: AppPermissions.DeleteHR }
        ]
    },
    {
        group: 'Vai trò (Roles)', items: [
            { name: 'ViewRoles', label: 'Xem Roles', value: AppPermissions.ViewRoles },
            { name: 'CreateRoles', label: 'Tạo Roles', value: AppPermissions.CreateRoles },
            { name: 'UpdateRoles', label: 'Cập nhật Roles', value: AppPermissions.UpdateRoles },
            { name: 'DeleteRoles', label: 'Xóa Roles', value: AppPermissions.DeleteRoles }
        ]
    },
    {
        group: 'Hệ thống / Users', items: [
            { name: 'ViewUsers', label: 'Xem Users', value: AppPermissions.ViewUsers },
            { name: 'CreateUsers', label: 'Tạo Users', value: AppPermissions.CreateUsers },
            { name: 'UpdateUsers', label: 'Cập nhật Users', value: AppPermissions.UpdateUsers },
            { name: 'DeleteUsers', label: 'Xóa Users', value: AppPermissions.DeleteUsers }
        ]
    },
    {
        group: 'Kho hàng', items: [
            { name: 'ViewInventory', label: 'Xem Kho', value: AppPermissions.ViewInventory },
            { name: 'CreateInventory', label: 'Tạo phiếu Kho', value: AppPermissions.CreateInventory },
            { name: 'UpdateInventory', label: 'Cập nhật Kho', value: AppPermissions.UpdateInventory },
            { name: 'DeleteInventory', label: 'Xóa phiếu Kho', value: AppPermissions.DeleteInventory }
        ]
    },
    {
        group: 'Bán hàng (POS)', items: [
            { name: 'ViewPOS', label: 'Truy cập Màn hình Bán hàng', value: AppPermissions.ViewPOS },
            { name: 'CreateOrderPOS', label: 'Tạo Đơn Hàng', value: AppPermissions.CreateOrderPOS },
            { name: 'ViewOrders', label: 'Xem Đơn Hàng', value: AppPermissions.ViewOrders }
        ]
    }
];
