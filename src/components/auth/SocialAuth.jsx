/** "or" divider between the main button and Google. */
export function OrDivider() {
  return (
    <div className="my-4 flex items-center gap-4 text-xs text-body">
      <span className="h-px flex-1 bg-line" />
      or
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}
