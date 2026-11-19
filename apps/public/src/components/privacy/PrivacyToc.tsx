type PrivacyTocGroup = {
  id: string;
  label: string;
  items: readonly { id: string; label: string }[];
};

type PrivacyTocProps = {
  heading: string;
  groups: readonly PrivacyTocGroup[];
};

export default function PrivacyToc({ heading, groups }: PrivacyTocProps) {
  return (
    <nav aria-label={heading} className="lg:sticky lg:top-24">
      <p className="font-mono text-xs uppercase tracking-wider text-teal">{heading}</p>
      <ul className="mt-3 space-y-5">
        {groups.map((group) => (
          <li key={group.id}>
            <a href={`#${group.id}`} className="inline-block py-1 font-display text-sm font-semibold text-charcoal hover:text-amber-deep">
              {group.label}
            </a>
            <ul className="mt-1 border-l border-line">
              {group.items.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="-ml-px block border-l-2 border-transparent py-1.5 pl-4 pr-2 text-sm text-ink/80 hover:border-amber hover:text-charcoal"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  );
}
