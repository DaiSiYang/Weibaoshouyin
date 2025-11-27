// secureKeyStore.ts — RAM-only，不被 Pinia 持久化

let runtimeKey: string | null = null

export const setRuntimeKey = (key: string) => {
  runtimeKey = key
}

export const getRuntimeKey = () => {
  return runtimeKey
}

export const clearRuntimeKey = () => {
  runtimeKey = null
}

