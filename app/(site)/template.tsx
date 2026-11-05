/** Re-mounts on every navigation → ivory curtain lifts and the page eases in. */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div aria-hidden className="page-curtain pointer-events-none fixed inset-0 z-[60] bg-paper-2" />
      <div className="page-in">{children}</div>
    </>
  )
}
