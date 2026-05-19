// Admin Suppliers List Page

import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Plus, Truck, Phone, Mail } from "lucide-react";
import Link from "next/link";
import { DeleteSupplierButton } from "./delete-supplier-button";

export default async function AdminSuppliersPage() {
  const suppliers = await db.supplier.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nhà cung cấp</h1>
          <p className="text-gray-600 text-sm mt-1">{suppliers.length} nhà cung cấp</p>
        </div>
        <Link href="/admin/suppliers/new">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <Plus className="h-4 w-4 mr-2" />
            Thêm NCC
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nhà cung cấp</TableHead>
              <TableHead>Liên hệ</TableHead>
              <TableHead>Mã số thuế</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                      <Truck className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{supplier.name}</p>
                      {supplier.code && (
                        <p className="text-xs text-gray-500 font-mono">{supplier.code}</p>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1 text-sm">
                    {supplier.contactName && <p className="text-gray-700">{supplier.contactName}</p>}
                    {supplier.phone && (
                      <p className="flex items-center gap-1 text-gray-500">
                        <Phone className="h-3 w-3" />{supplier.phone}
                      </p>
                    )}
                    {supplier.email && (
                      <p className="flex items-center gap-1 text-gray-500">
                        <Mail className="h-3 w-3" />{supplier.email}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {supplier.taxCode || "—"}
                </TableCell>
                <TableCell>
                  <Badge className={`border-0 ${supplier.isActive ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>
                    {supplier.isActive ? "Hoạt động" : "Ngừng"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/suppliers/${supplier.id}/edit`}>
                      <Button variant="outline" size="sm">Sửa</Button>
                    </Link>
                    <DeleteSupplierButton supplierId={supplier.id} supplierName={supplier.name} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {suppliers.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <Truck className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p className="font-medium">Chưa có nhà cung cấp</p>
          </div>
        )}
      </div>
    </div>
  );
}
