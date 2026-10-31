'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Phone, Mail, MapPin, Clock, CheckCircle2 } from 'lucide-react';

export default function BookingForm() {
  const t = useTranslations('HomePage.booking');
  const locale = useLocale();
  const [contact, setContact] = useState({
    phone: '090 296 0757',
    email: 'contact@ngochuongspa.vn',
    address: '79 đường 3/2, Quận 10, TP.HCM'
  });
  const [services, setServices] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: 'Chăm Sóc Da Mặt Chuyên Sâu'
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setContact({
            phone: data.data.phone || '090 296 0757',
            email: data.data.email || 'contact@ngochuongspa.vn',
            address: data.data.address || '79 đường 3/2, Quận 10, TP.HCM'
          });
        }
      });

    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setServices(data.data);
          const firstTitle = data.data[0][locale]?.title || data.data[0].vi?.title || '';
          if (firstTitle) {
            setFormData(prev => ({ ...prev, service: firstTitle }));
          }
        }
      });
  }, [locale]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setSubmitted(true);
        setFormData(prev => ({ ...prev, name: '', phone: '' }));
        setTimeout(() => setSubmitted(false), 5000);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-gradient-to-br from-[#f4ece1] via-[#f7eef0] to-[#eef2ed] relative overflow-hidden">
      {/* Soft organic botanical blurs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#9e5a6b]/10 rounded-full -translate-x-1/3 -translate-y-1/3 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#c8a46e]/15 rounded-full translate-x-1/4 translate-y-1/4 blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto bg-white rounded-[2.5rem] shadow-[0_20px_60px_-20px_rgba(110,80,75,0.16)] overflow-hidden flex flex-col md:flex-row border border-[#efe6dd]">
          <div className="w-full md:w-5/12 bg-[#fcf9f5] p-8 md:p-11 flex flex-col justify-between border-r border-[#efe6dd]">
            <div>
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#9e5a6b] bg-[#f7eef0] border border-[#ead6db] px-3.5 py-1.5 rounded-full">
                Ngọc Hương Natural Spa
              </span>
              <h2 className="text-3xl font-semibold text-[#3d312e] mt-5 mb-3">{t('heading')}</h2>
              <p className="text-[#6e5c57] text-sm md:text-base leading-relaxed mb-8">{t('subheading')}</p>
            </div>
            
            <div className="space-y-5">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[#9e5a6b] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-medium text-[#8c7a74] uppercase tracking-wider">Hotline Tư Vấn</h4>
                  <p className="text-xl font-semibold text-[#9e5a6b]">{contact.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[#f7eef0] text-[#9e5a6b] flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-medium text-[#8c7a74] uppercase tracking-wider">Địa chỉ</h4>
                  <p className="text-sm font-medium text-[#4a3b38]">{contact.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[#f7eef0] text-[#9e5a6b] flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-medium text-[#8c7a74] uppercase tracking-wider">Email</h4>
                  <p className="text-sm font-medium text-[#4a3b38]">{contact.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-[#eef2ed] text-[#6e806b] flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-medium text-[#8c7a74] uppercase tracking-wider">Giờ mở cửa</h4>
                  <p className="text-sm font-medium text-[#4a3b38]">08:30 - 20:30 (Tất cả các ngày)</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-7/12 p-8 md:p-11 bg-white">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-[#4a3b38] mb-2">{t('form.name')}</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3.5 rounded-2xl border border-[#e6dcd2] bg-[#fcf9f5] text-[#3d312e] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#9e5a6b]/20 focus:border-[#9e5a6b] transition-all"
                  placeholder="Nguyễn Thị Mai"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4a3b38] mb-2">{t('form.phone')}</label>
                <input 
                  type="tel" 
                  required
                  value={formData.phone}
                  onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3.5 rounded-2xl border border-[#e6dcd2] bg-[#fcf9f5] text-[#3d312e] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#9e5a6b]/20 focus:border-[#9e5a6b] transition-all"
                  placeholder="090 123 4567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4a3b38] mb-2">{t('form.service')}</label>
                <select
                  value={formData.service}
                  onChange={e => setFormData(prev => ({ ...prev, service: e.target.value }))}
                  className="w-full px-4 py-3.5 rounded-2xl border border-[#e6dcd2] bg-[#fcf9f5] text-[#3d312e] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#9e5a6b]/20 focus:border-[#9e5a6b] transition-all"
                >
                  {services.length > 0 ? (
                    services.map((s) => {
                      const title = s[locale]?.title || s.vi?.title || s.id;
                      return <option key={s.id} value={title}>{title}</option>;
                    })
                  ) : (
                    <>
                      <option>Chăm Sóc Da Mặt Chuyên Sâu</option>
                      <option>Massage Trị Liệu Thảo Dược</option>
                      <option>Trẻ Hóa Da Tự Nhiên</option>
                    </>
                  )}
                </select>
              </div>
              {submitted && (
                <div className="p-4 rounded-2xl bg-[#eef2ed] border border-[#d5dfd3] text-[#4b5d48] text-sm font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-[#6e806b]" />
                  {locale === 'vi' ? 'Đã gửi yêu cầu đặt lịch hẹn thành công! Chuyên viên sẽ liên hệ sớm với bạn.' : 'Booking request submitted successfully! We will contact you soon.'}
                </div>
              )}
              <motion.button 
                type="submit"
                disabled={submitting}
                className="w-full bg-[#9e5a6b] hover:bg-[#874959] text-white font-medium text-lg py-4 rounded-full transition-all shadow-[0_10px_28px_-6px_rgba(158,90,107,0.45)] disabled:opacity-50 cursor-pointer"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {submitting ? '...' : t('form.submit')}
              </motion.button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
