import { useSettings } from '../../hooks/useSettings';
import { pickSetting } from '../../lib/i18n';
import { buildWhatsAppLink } from '../../lib/whatsapp';
import { WhatsAppIcon } from '../ui/WhatsAppIcon';

export function WhatsAppFloat() {
  const { data: settings } = useSettings();
  const number = pickSetting(settings, 'whatsapp_number', 'en', '');
  if (!number) return null;

  const href = buildWhatsAppLink(
    number,
    'Assalam o Alaikum ASATEK, I would like wholesale product details.',
  );

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      data-testid="whatsapp-float"
      className="fixed bottom-5 end-5 z-40 inline-flex h-13 w-13 items-center justify-center rounded-full bg-[var(--whatsapp)] text-white shadow-lg hover:bg-[var(--whatsapp-dark)] transition-transform duration-150 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--whatsapp)]"
    >
      <WhatsAppIcon className="w-7 h-7" />
    </a>
  );
}
