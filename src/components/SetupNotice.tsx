type SetupNoticeProps = {
  body: string;
  title: string;
};

export function SetupNotice({ body, title }: SetupNoticeProps) {
  return (
    <div className="rounded-2xl border border-secondary/25 bg-secondary/8 p-5 text-left shadow-[0_16px_40px_-24px_rgba(0,227,253,0.45)]">
      <p className="text-[11px] font-label uppercase tracking-[0.24em] text-secondary mb-2">Setup Required</p>
      <h3 className="text-lg font-headline font-bold text-on-surface mb-2">{title}</h3>
      <p className="text-sm text-on-surface-variant leading-relaxed">{body}</p>
    </div>
  );
}
