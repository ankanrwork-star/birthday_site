/** Slow-drifting gradient blobs behind everything. Pure CSS animation. */
export default function Background() {
  return (
    <div className="bg" aria-hidden="true">
      <span className="blob b1" />
      <span className="blob b2" />
      <span className="blob b3" />
      <span className="blob b4" />
    </div>
  )
}
