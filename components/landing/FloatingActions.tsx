import { WhatsAppIcon } from "../icons";

function waLink(num: string) {
  const digits = num.replace(/\D/g, "");
  return `https://wa.me/${digits.startsWith("88") ? digits : `88${digits}`}`;
}

export default function FloatingActions({ whatsapp }: { whatsapp: string }) {
  if (!whatsapp) return null;
  return (
    <a
      href={waLink(whatsapp)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      className="fixed bottom-6 right-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25d366] text-white shadow-xl"
    >
      <WhatsAppIcon className="h-8 w-8" />
    </a>
  );
}
