const { execSync } = require('child_process');

const files = [
    ['src/app/admin/products/products.component.html', 'PRODUCTS'],
    ['src/app/admin/products/low-stock/low-stock.component.html', 'PRODUCTS'],
    ['src/app/admin/categories/categories.component.html', 'CATEGORIES'],

    ['src/app/admin/inventory/inventory.component.html', 'INVENTORY'],
    ['src/app/admin/inventory/wastage-list/wastage-list.component.html', 'WASTAGE'],
    ['src/app/admin/inventory/wastage-create/wastage-create.component.html', 'WASTAGE'],
    ['src/app/admin/stock-takes/stock-takes.component.html', 'STOCK_TAKE'],
    ['src/app/admin/stock-takes/stock-take-detail/stock-take-detail.component.html', 'STOCK_TAKE'],
    ['src/app/admin/stock-takes/stock-take-create/stock-take-create.component.html', 'STOCK_TAKE'],

    ['src/app/admin/pos/pos.component.html', 'POS'],
    ['src/app/admin/orders/orders.component.html', 'ORDERS'],
    ['src/app/admin/return-orders/return-order-list/return-order-list.component.html', 'RETURN_ORDERS'],
    ['src/app/admin/return-orders/return-order-detail/return-order-detail.component.html', 'RETURN_ORDERS'],
    ['src/app/admin/return-orders/return-order-form/return-order-form.component.html', 'RETURN_ORDERS'],
    ['src/app/admin/transactions/transactions.component.html', 'TRANSACTIONS'],
    ['src/app/admin/transaction-detail/transaction-detail.component.html', 'TRANSACTIONS'],
    ['src/app/admin/transaction-create/transaction-create.component.html', 'TRANSACTIONS'],

    ['src/app/admin/customers/customers.component.html', 'CUSTOMERS'],
    ['src/app/admin/customer-debts/customer-debts.component.html', 'CUSTOMER_DEBTS'],
    ['src/app/admin/suppliers/suppliers.component.html', 'SUPPLIERS'],
    ['src/app/admin/supplier-debts/supplier-debts.component.html', 'SUPPLIER_DEBTS'],
    ['src/app/admin/reports/reports.component.html', 'REPORTS'],
    ['src/app/admin/audits/audits.component.html', 'AUDITS'],
    ['src/app/admin/users/users.component.html', 'USERS'],
    ['src/app/admin/roles/roles.component.html', 'ROLES'],
    ['src/app/admin/shift-schedules/shift-schedules.component.html', 'SHIFTS'],
    ['src/app/admin/promotions/promotions.component.html', 'PROMOTIONS'],
    ['src/app/admin/dashboard/dashboard.component.html', 'DASHBOARD'],
    ['src/app/admin/admin-layout/admin-layout.component.html', 'COMMON'],

    ['src/app/store/home/home.component.html', 'STORE'],
    ['src/app/store/store-layout/store-layout.component.html', 'STORE'],
    ['src/app/auth/login/login.component.html', 'AUTH'],
    ['src/app/app.component.html', 'COMMON'],
    ['src/app/shared/components/modal/modal.component.html', 'COMMON'],
    ['src/app/shared/components/pagination/pagination.component.html', 'COMMON'],
    ['src/app/shared/components/loading/loading.component.html', 'COMMON'],
    ['src/app/admin/purchase-orders/purchase-orders.component.html', 'PURCHASE_ORDERS'],
    ['src/app/admin/purchase-orders/purchase-order-create/purchase-order-create.component.html', 'PURCHASE_ORDERS'],
    ['src/app/admin/purchase-orders/purchase-order-detail/purchase-order-detail.component.html', 'PURCHASE_ORDERS']
];

for (const [file, module] of files) {
    try {
        console.log(`Running on ${file}`);
        execSync(`node translate.js ${file} ${module}`);
    } catch (e) {
        console.error(`Error on ${file}:`, e.message);
    }
}
