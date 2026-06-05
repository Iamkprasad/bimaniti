export default function ImageFallback({ width = '100%', height = '200px' }) {
  return (
    <div
      className="img-fallback"
      style={{ width, height }}
    >
      Image unavailable
    </div>
  );
}
