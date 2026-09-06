import type { AppData, SyncSettings } from '../types'
import { exportPayload, migrate } from './storage'

const API = 'https://api.github.com'

function headers(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json',
  }
}

function toBase64(text: string): string {
  const bytes = new TextEncoder().encode(text)
  let binary = ''
  for (const b of bytes) binary += String.fromCharCode(b)
  return btoa(binary)
}

function fromBase64(b64: string): string {
  const binary = atob(b64.replace(/\s/g, ''))
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

function contentsUrl(sync: SyncSettings): string {
  return `${API}/repos/${sync.repo}/contents/${sync.path}`
}

async function fail(res: Response): Promise<never> {
  let detail = res.statusText
  try {
    const body = (await res.json()) as { message?: string }
    if (body.message) detail = body.message
  } catch {
    // Non-JSON error body; the status text is all we have.
  }
  if (res.status === 401) throw new Error('GitHub rejected the token (401). Is it expired?')
  if (res.status === 403) throw new Error(`Forbidden (403). Token needs Contents: read and write. ${detail}`)
  if (res.status === 404) throw new Error(`Not found (404). Check the repo name and that the token can see it.`)
  if (res.status === 409) throw new Error('Conflict (409) — the file changed on GitHub. Pull first, then push.')
  throw new Error(`GitHub error ${res.status}: ${detail}`)
}

/** Current blob SHA of the history file, or undefined if it doesn't exist yet. */
export async function remoteSha(sync: SyncSettings): Promise<string | undefined> {
  const res = await fetch(`${contentsUrl(sync)}?ref=${encodeURIComponent(sync.branch)}`, {
    headers: headers(sync.token),
  })
  if (res.status === 404) return undefined
  if (!res.ok) await fail(res)
  const body = (await res.json()) as { sha: string }
  return body.sha
}

export interface PushResult {
  sha: string
  syncedAt: string
}

/** Writes the history snapshot to the repo, creating the file on first push. */
export async function push(data: AppData): Promise<PushResult> {
  const sync = data.settings.sync
  if (!sync.token) throw new Error('No GitHub token set — add one in Settings.')
  const sha = await remoteSha(sync)
  const payload = exportPayload(data)
  const sessions = payload.sessions.length
  const res = await fetch(contentsUrl(sync), {
    method: 'PUT',
    headers: headers(sync.token),
    body: JSON.stringify({
      message: `Sync workout history (${sessions} session${sessions === 1 ? '' : 's'})`,
      content: toBase64(`${JSON.stringify(payload, null, 2)}\n`),
      branch: sync.branch,
      ...(sha ? { sha } : {}),
    }),
  })
  if (!res.ok) await fail(res)
  const body = (await res.json()) as { content: { sha: string } }
  return { sha: body.content.sha, syncedAt: new Date().toISOString() }
}

/** Reads the snapshot back from the repo, e.g. onto a new phone. */
export async function pull(sync: SyncSettings): Promise<AppData> {
  if (!sync.token) throw new Error('No GitHub token set — add one in Settings.')
  const res = await fetch(`${contentsUrl(sync)}?ref=${encodeURIComponent(sync.branch)}`, {
    headers: headers(sync.token),
  })
  if (!res.ok) await fail(res)
  const body = (await res.json()) as { content: string }
  const parsed = JSON.parse(fromBase64(body.content)) as Partial<AppData>
  const merged = migrate(parsed)
  // The remote snapshot never carries credentials; keep the local ones.
  merged.settings.sync = sync
  return merged
}
