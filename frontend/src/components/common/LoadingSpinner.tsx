export default function LoadingSpinner({ text = 'Loading...' }: { text?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 24, justifyContent: 'center' }}>
      <span className="spinner" />
      <span style={{ color: '#6b7280', fontSize: 14 }}>{text}</span>
    </div>
  );
}
