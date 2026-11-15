import { SIGN_MAP } from '../data/signs';

export default function SignImage({ id, small, label }: { id: string; small?: boolean; label?: string }) {
  const s = SIGN_MAP[id];
  if (!s) return null;
  return (
    <svg
      className={`app-sign${small ? ' app-sign--small' : ''}`}
      viewBox="0 0 100 100"
      role="img"
      aria-label={label ?? `Road sign: ${s.look}`}
      focusable="false"
    >
      {s.draw()}
    </svg>
  );
}
