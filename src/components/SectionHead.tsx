/** Swiss-style section header: a small orb + label on the left, the headline on the right. */
export default function SectionHead({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <header className="mb-16 grid gap-6 sm:mb-24 lg:grid-cols-12">
      <p className="label flex items-center gap-2 lg:col-span-3">
        <span className="orb-dot inline-block h-3 w-3" />
        {label}
      </p>
      <div className="lg:col-span-9">{children}</div>
    </header>
  );
}
