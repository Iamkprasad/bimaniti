interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
}

export const PageHeader = ({ eyebrow, title, description }: PageHeaderProps) => {
  return (
    <section className="page-header">
      <div className="max-w-5xl mx-auto text-center">
        {eyebrow && <div className="page-eyebrow">{eyebrow}</div>}
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 500, marginBottom: '10px', color: 'var(--text-primary)' }}>
          {title}
        </h1>
        {description && (
          <p style={{ color: 'var(--text-muted)', maxWidth: '36rem', margin: '0 auto', fontSize: '15px', fontWeight: 300 }}>
            {description}
          </p>
        )}
      </div>
    </section>
  );
};