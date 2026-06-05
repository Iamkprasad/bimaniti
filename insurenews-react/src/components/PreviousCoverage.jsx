export default function PreviousCoverage({ previousCoverage }) {
  if (!previousCoverage) return null;

  return (
    <div className="previous-coverage">
      <strong>Previous Coverage:</strong>{' '}
      <a href={`/post?id=${previousCoverage.id}`}>
        {previousCoverage.title}
      </a>
    </div>
  );
}
