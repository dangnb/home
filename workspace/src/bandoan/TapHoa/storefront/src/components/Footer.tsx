export default function Footer() {
  return (
    <footer className="bg-white border-t py-12 mt-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-black tracking-tight text-emerald-600 mb-4">
            TapHoa<span className="text-gray-900">.</span>
          </h3>
          <p className="text-gray-500 text-sm">
            Tạp hóa trực tuyến tiện lợi. Mua sắm mọi thứ bạn cần với giá tốt nhất, giao hàng nhanh chóng.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-4">Danh mục</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><a href="#" className="hover:text-emerald-600">Đồ uống</a></li>
            <li><a href="#" className="hover:text-emerald-600">Bánh kẹo</a></li>
            <li><a href="#" className="hover:text-emerald-600">Gia vị</a></li>
            <li><a href="#" className="hover:text-emerald-600">Hóa mỹ phẩm</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Hỗ trợ</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><a href="#" className="hover:text-emerald-600">Chính sách vận chuyển</a></li>
            <li><a href="#" className="hover:text-emerald-600">Chính sách đổi trả</a></li>
            <li><a href="#" className="hover:text-emerald-600">Câu hỏi thường gặp</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Liên hệ</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li>Hotline: 1900 1234</li>
            <li>Email: support@taphoa.vn</li>
            <li>Địa chỉ: 123 Đường ABC, TP.HCM</li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-8 pt-8 border-t text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()} TapHoa. Đã đăng ký bản quyền.
      </div>
    </footer>
  );
}
