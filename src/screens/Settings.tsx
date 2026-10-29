import { useState } from 'react'
import { CATALOG, GROUPS } from '../data/exercises'
import { ExerciseIcon, ICON_KEYS } from '../icons/ExerciseIcon'
import { exerciseLoads } from '../lib/recovery'
import { exportPayload, migrate } from '../lib/storage'
import { pull, push } from '../lib/sync'
import { useStore } from '../store'
import type { Exercise, MuscleGroup, Unit } from '../types'

type Status = { kind: 'ok' | 'err' | ''; text: string }

export function Settings() {
  const store = useStore()
  const { settings, data } = store
  const [status, setStatus] = useState<Status>({ kind: '', text: '' })
  const [busy, setBusy] = useState(false)

  const sync = settings.sync

  const patchSync = (patch: Partial<typeof sync>) =>
    store.updateSettings({ sync: { ...sync, ...patch } })

  const doPush = async () => {
    setBusy(true)
    setStatus({ kind: '', text: 'Pushing…' })
    try {
      const result = await push(data)
      patchSync({ lastSha: result.sha, lastSyncedAt: result.syncedAt })
      setStatus({ kind: 'ok', text: `Pushed ${data.sessions.length} sessions to ${sync.repo}.` })
    } catch (e) {
      setStatus({ kind: 'err', text: (e as Error).message })
    } finally {
      setBusy(false)
    }
  }

  const doPull = async () => {
    if (
      data.sessions.length > 0 &&
      !confirm('Replace everything on this device with the copy in the repo?')
    )
      return
    setBusy(true)
    setStatus({ kind: '', text: 'Pulling…' })
    try {
      const next = await pull(sync)
      store.replaceData(next)
      setStatus({ kind: 'ok', text: `Restored ${next.sessions.length} sessions.` })
    } catch (e) {
      setStatus({ kind: 'err', text: (e as Error).message })
    } finally {
      setBusy(false)
    }
  }

  const copyJson = async () => {
    const json = JSON.stringify(exportPayload(data), null, 2)
    try {
      await navigator.clipboard.writeText(json)
      setStatus({ kind: 'ok', text: 'History copied to the clipboard.' })
    } catch {
      setStatus({ kind: 'err', text: 'Clipboard blocked — use Download instead.' })
    }
  }

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(exportPayload(data), null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `workouts-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importJson = () => {
    const raw = prompt('Paste an exported history JSON:')
    if (!raw) return
    try {
      const next = migrate(JSON.parse(raw))
      next.settings.sync = sync
      store.replaceData(next)
      setStatus({ kind: 'ok', text: `Imported ${next.sessions.length} sessions.` })
    } catch {
      setStatus({ kind: 'err', text: "That didn't parse as exported history JSON." })
    }
  }

  return (
    <>
      <div className="section-label">Units</div>
      <div className="card">
        <div className="row2">
          <div className="field" style={{ marginBottom: 0 }}>
            <label htmlFor="unit">Weight unit</label>
            <select
              id="unit"
              value={settings.unit}
              onChange={(e) => store.updateSettings({ unit: e.target.value as Unit })}
            >
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </select>
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label htmlFor="step">Stepper increment</label>
            <input
              id="step"
              type="text"
              inputMode="decimal"
              value={String(settings.step)}
              onChange={(e) => {
                const n = Number(e.target.value.replace(',', '.'))
                if (Number.isFinite(n) && n > 0) store.updateSettings({ step: n })
              }}
            />
          </div>
        </div>
      </div>

      <div className="section-label">Recovery</div>
      <div className="card">
        <div className="field" style={{ marginBottom: 6 }}>
          <label htmlFor="recovery">Hours before a muscle group can be trained hard again</label>
          <input
            id="recovery"
            type="text"
            inputMode="numeric"
            value={String(settings.recoveryHours)}
            onChange={(e) => {
              const n = Number(e.target.value)
              if (Number.isFinite(n) && n >= 0 && n <= 336) store.updateSettings({ recoveryHours: n })
            }}
          />
        </div>
        <div className="hint" style={{ margin: 0 }}>
          Counted from the last set, not from midnight. Sessions logged before
          this app recorded clock times are assumed to have ended at 23:59 on
          their day, which errs toward waiting rather than clearing early.
        </div>
      </div>

      <div className="section-label">Backup to GitHub</div>
      <div className="card">
        <div className="field">
          <label htmlFor="repo">Repository</label>
          <input
            id="repo"
            value={sync.repo}
            onChange={(e) => patchSync({ repo: e.target.value.trim() })}
            placeholder="owner/repo"
            autoCapitalize="off"
            autoCorrect="off"
          />
        </div>
        <div className="row2">
          <div className="field">
            <label htmlFor="branch">Branch</label>
            <input
              id="branch"
              value={sync.branch}
              onChange={(e) => patchSync({ branch: e.target.value.trim() })}
              autoCapitalize="off"
            />
          </div>
          <div className="field">
            <label htmlFor="path">File path</label>
            <input
              id="path"
              value={sync.path}
              onChange={(e) => patchSync({ path: e.target.value.trim() })}
              autoCapitalize="off"
            />
          </div>
        </div>
        <div className="field">
          <label htmlFor="token">Fine-grained token (Contents: read and write)</label>
          <input
            id="token"
            type="password"
            value={sync.token}
            onChange={(e) => patchSync({ token: e.target.value.trim() })}
            placeholder="github_pat_…"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
          />
        </div>
        <div className="row2">
          <button className="primary" onClick={doPush} disabled={busy}>
            Push
          </button>
          <button className="primary ghost" onClick={doPull} disabled={busy}>
            Pull
          </button>
        </div>
        <div className={`status ${status.kind}`}>{status.text}</div>
        <div className="hint" style={{ margin: 0 }}>
          The token is stored only in this browser and is sent only to api.github.com.
          It is never written into the exported history. Scope it to this one repo.
          {sync.lastSyncedAt && ` Last push: ${new Date(sync.lastSyncedAt).toLocaleString()}.`}
        </div>
      </div>

      <div className="section-label">Export</div>
      <div className="card">
        <div className="row2">
          <button className="primary ghost" onClick={copyJson}>
            Copy JSON
          </button>
          <button className="primary ghost" onClick={downloadJson}>
            Download
          </button>
        </div>
        <div style={{ height: 9 }} />
        <button className="primary ghost" onClick={importJson}>
          Import from JSON
        </button>
      </div>

      <ManageExercises />
      <AddExercise onDone={(text) => setStatus({ kind: 'ok', text })} />
    </>
  )
}

function ManageExercises() {
  const store = useStore()
  const { allExercises, settings } = store
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="section-label">
        Exercises · {allExercises.length - settings.hidden.length} shown
      </div>
      <div className="card">
        <button className="primary ghost" onClick={() => setOpen((v) => !v)}>
          {open ? 'Done' : 'Show / hide exercises'}
        </button>
        {open && (
          <div style={{ marginTop: 12 }}>
            {GROUPS.map((g) => (
              <div key={g.id}>
                <div className="section-label" style={{ marginTop: 14 }}>
                  {g.label}
                </div>
                {allExercises
                  .filter((e) => e.group === g.id)
                  .map((e) => {
                    const hidden = settings.hidden.includes(e.id)
                    return (
                      <div className={`manage ${hidden ? 'off' : ''}`} key={e.id}>
                        <ExerciseIcon icon={e.icon} loads={exerciseLoads(e)} size={24} />
                        <span className="mname">{e.name}</span>
                        <button
                          className="pill"
                          onClick={() => store.toggleHidden(e.id)}
                          style={{ minHeight: 34 }}
                        >
                          {hidden ? 'Show' : 'Hide'}
                        </button>
                        {e.custom && (
                          <button
                            className="pill"
                            onClick={() => store.deleteExercise(e.id)}
                            style={{ minHeight: 34 }}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    )
                  })}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

function AddExercise({ onDone }: { onDone: (text: string) => void }) {
  const store = useStore()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [group, setGroup] = useState<MuscleGroup>('chest')
  const [icon, setIcon] = useState(ICON_KEYS[0])

  const submit = () => {
    const trimmed = name.trim()
    if (!trimmed) return
    const base = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    const taken = new Set(store.allExercises.map((e) => e.id))
    let id = `custom-${base}`
    let n = 2
    while (taken.has(id)) id = `custom-${base}-${n++}`
    const exercise: Exercise = { id, name: trimmed, icon, group, equipment: 'machine', custom: true }
    store.addExercise(exercise)
    setName('')
    setOpen(false)
    onDone(`Added ${trimmed}.`)
  }

  return (
    <div className="card">
      <button className="primary ghost" onClick={() => setOpen((v) => !v)}>
        {open ? 'Cancel' : 'Add a custom exercise'}
      </button>
      {open && (
        <div style={{ marginTop: 12 }}>
          <div className="field">
            <label htmlFor="ex-name">Name</label>
            <input id="ex-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="ex-group">Muscle group</label>
            <select
              id="ex-group"
              value={group}
              onChange={(e) => setGroup(e.target.value as MuscleGroup)}
            >
              {GROUPS.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Icon</label>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(56px, 1fr))' }}>
              {ICON_KEYS.map((key) => (
                <button
                  key={key}
                  className="tile"
                  style={{
                    minHeight: 56,
                    borderColor: key === icon ? 'var(--accent)' : undefined,
                    background: key === icon ? 'var(--accent-dim)' : undefined,
                  }}
                  onClick={() => setIcon(key)}
                  aria-label={key}
                >
                  <ExerciseIcon icon={key} loads={{ [group]: 1 }} size={28} />
                </button>
              ))}
            </div>
          </div>
          <button className="primary" onClick={submit}>
            Add exercise
          </button>
        </div>
      )}
    </div>
  )
}

export const CATALOG_SIZE = CATALOG.length
