import Button from "@/components/Button";
import Modal from "@/components/Modal";
import type { Dictionary } from "@/lib/i18n";

export interface MarketplaceInstallModalProps {
  t: Dictionary["pages"]["products"]["view"]["marketplace"];
  onClose: () => void;
}

/** Short instructions shown when the extension did not answer. */
export function MarketplaceInstallModal({ t, onClose }: MarketplaceInstallModalProps) {
  return (
    <Modal title={t.installTitle} description={t.installIntro} onClose={onClose}>
      <ol className="list-decimal space-y-2 pl-5 text-sm text-ink">
        {t.installSteps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      <div className="flex justify-end">
        <Button onClick={onClose}>{t.close}</Button>
      </div>
    </Modal>
  );
}

export default MarketplaceInstallModal;
