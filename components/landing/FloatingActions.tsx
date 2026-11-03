import { PhoneIcon, WhatsAppIcon } from "../icons";

function waLink(num: string) {
  const digits = num.replace(/\D/g, "");
  return `https://wa.me/${digits.startsWith("88") ? digits : `88${digits}`}`;
}

export default function FloatingActions({ phone, whatsapp }: { phone: string; whatsapp: string }) {
  return (
    <>
      {whatsapp && (
        <a
          href={waLink(whatsapp)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          className="fixed bottom-24 right-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25d366] text-white shadow-xl md:bottom-6"
        >
          <WhatsAppIcon className="h-8 w-8" />
        </a>
      )}
      {/* sticky bottom bar on phones */}
      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-[auto_1fr] gap-2 border-t border-pink-200 bg-white/95 p-2 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] backdrop-blur md:hidden">
        {phone && (
          <a href={`tel:${phone}`} className="flex items-center gap-2 rounded-xl border-2 border-brand px-4 font-bold text-brand">
            <PhoneIcon className="h-5 w-5" /> কল করুন
          </a>
        )}
        <a href="#order" className="rounded-xl bg-brand py-3 text-center font-display text-xl font-bold text-white">
          এখনই অর্ডার করুন
        </a>
      </div>
    </>
  );
}
