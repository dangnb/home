export const AppPermissions = {
    None: 0,

    // Users (1-15)
    ViewUsers: 1 << 0,
    CreateUsers: 1 << 1,
    UpdateUsers: 1 << 2,
    DeleteUsers: 1 << 3,
    AssignRoles: 1 << 4,

    // Roles (16-31)
    ViewRoles: 1 << 10,
    CreateRoles: 1 << 11,
    UpdateRoles: 1 << 12,
    DeleteRoles: 1 << 13,

    // Products & Categories (32-47)
    ViewProducts: 1 << 20,
    CreateProducts: 1 << 21,
    UpdateProducts: 1 << 22,
    DeleteProducts: 1 << 23,
    ViewCategories: 1 << 24,
    CreateCategories: 1 << 25,
    UpdateCategories: 1 << 26,
    DeleteCategories: 1 << 27

    // JS bitwise operators work on 32-bit integers. 
    // Since we exceed or approach 32 bits, we actually should use BigInt or simply math for large keys.
    // For now, since highest is 1<<27, JavaScript standard bitwise `<<` is safe (up to 31).
};

export const AppPermissionsList = [
    {
        group: 'Trái cây / Sản phẩm', items: [
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
        group: 'Nhân sự / Users', items: [
            { name: 'ViewUsers', label: 'Xem Users', value: AppPermissions.ViewUsers },
            { name: 'CreateUsers', label: 'Tạo Users', value: AppPermissions.CreateUsers },
            { name: 'UpdateUsers', label: 'Cập nhật Users', value: AppPermissions.UpdateUsers },
            { name: 'DeleteUsers', label: 'Xóa Users', value: AppPermissions.DeleteUsers },
            { name: 'AssignRoles', label: 'Phân quyền Users', value: AppPermissions.AssignRoles }
        ]
    },
    {
        group: 'Vai trò / Roles', items: [
            { name: 'ViewRoles', label: 'Xem Roles', value: AppPermissions.ViewRoles },
            { name: 'CreateRoles', label: 'Tạo Roles', value: AppPermissions.CreateRoles },
            { name: 'UpdateRoles', label: 'Cập nhật Roles', value: AppPermissions.UpdateRoles },
            { name: 'DeleteRoles', label: 'Xóa Roles', value: AppPermissions.DeleteRoles }
        ]
    }
];
