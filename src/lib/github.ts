const GH = 'https://api.github.com'

export const ghHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'Content-Type': 'application/json',
})

export async function dispatchWorkflow(
  org: string,
  repo: string,
  token: string,
  workflow: string,
  ref = 'main',
  inputs: Record<string, string> = {},
): Promise<void> {
  const res = await fetch(`${GH}/repos/${org}/${repo}/actions/workflows/${workflow}/dispatches`, {
    method: 'POST',
    headers: ghHeaders(token),
    body: JSON.stringify({ ref, inputs }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`dispatchWorkflow(${org}/${repo}/${workflow}) failed ${res.status}: ${text}`)
  }
}

export async function setRepoVar(
  org: string,
  repo: string,
  token: string,
  name: string,
  value: string,
): Promise<void> {
  const res = await fetch(`${GH}/repos/${org}/${repo}/actions/variables`, {
    method: 'POST',
    headers: ghHeaders(token),
    body: JSON.stringify({ name, value }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`setRepoVar(${name}) failed ${res.status}: ${text}`)
  }
}

export async function waitForRepo(
  org: string,
  repo: string,
  token: string,
  attempts = 8,
): Promise<boolean> {
  for (let i = 0; i < attempts; i++) {
    const res = await fetch(`${GH}/repos/${org}/${repo}`, { headers: ghHeaders(token) })
    if (res.ok) return true
    await new Promise(r => setTimeout(r, 2000))
  }
  return false
}
