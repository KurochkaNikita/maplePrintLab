export interface GeneralSettingsPanelProps {
  text: string;
}

/** Placeholder until the general settings exist. */
export function GeneralSettingsPanel({ text }: GeneralSettingsPanelProps) {
  return (
    <p className="rounded-2xl border border-dashed border-line bg-white p-6 text-sm text-ink">{text}</p>
  );
}

export default GeneralSettingsPanel;
