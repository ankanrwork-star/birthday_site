// Synthesised "Happy Birthday" (public domain) — no audio file needed.
const N = { G4: 392, A4: 440, B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99 }
// [note, beats] — four phrases of 6 beats each
const TUNE = [
  ['G4', 0.75], ['G4', 0.25], ['A4', 1], ['G4', 1], ['C5', 1], ['B4', 2],
  ['G4', 0.75], ['G4', 0.25], ['A4', 1], ['G4', 1], ['D5', 1], ['C5', 2],
  ['G4', 0.75], ['G4', 0.25], ['G5', 1], ['E5', 1], ['C5', 1], ['B4', 1], ['A4', 1],
  ['F5', 0.75], ['F5', 0.25], ['E5', 1], ['C5', 1], ['D5', 1], ['C5', 2],
].map(([n, b]) => [N[n], b])
const BEAT = 0.46

let ctx = null
let master = null

export function stopBirthday() {
  if (!master || !ctx) return
  const m = master
  master = null
  try {
    m.gain.cancelScheduledValues(ctx.currentTime)
    m.gain.setTargetAtTime(0, ctx.currentTime, 0.05)
    setTimeout(() => m.disconnect(), 400)
  } catch {}
}

export function playBirthday() {
  try {
    stopBirthday()
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return
    ctx = ctx || new AC()
    if (ctx.state === 'suspended') ctx.resume()
    master = ctx.createGain()
    master.gain.value = 0.22
    master.connect(ctx.destination)

    let t = ctx.currentTime + 0.25
    for (const [freq, beats] of TUNE) {
      const dur = beats * BEAT
      for (const [mult, vol, type] of [[1, 1, 'triangle'], [2, 0.25, 'sine']]) {
        const o = ctx.createOscillator()
        const g = ctx.createGain()
        o.type = type
        o.frequency.value = freq * mult
        g.gain.setValueAtTime(0.0001, t)
        g.gain.exponentialRampToValueAtTime(vol, t + 0.015)
        g.gain.exponentialRampToValueAtTime(0.0001, t + Math.max(dur * 0.95, 0.2))
        o.connect(g).connect(master)
        o.start(t)
        o.stop(t + dur + 0.1)
      }
      t += dur
    }
  } catch {}
}
