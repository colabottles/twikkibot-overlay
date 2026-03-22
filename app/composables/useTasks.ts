import { ref, onMounted, onUnmounted } from 'vue'
import { useSupabase } from './useSupabase'

export interface Task {
  id: string
  username: string
  text: string
  status: 'active' | 'backlog' | 'done'
  position: number
  updated_at: string
}

export interface UserTasks {
  username: string
  active: Task | null
  backlog: Task[]
  done: Task[]
}

export function useTasks(channel: string) {
  const supabase = useSupabase()
  const userTasks = ref<UserTasks[]>([])

  async function fetchTasks() {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()

    const { data } = await supabase
      .from('tasks')
      .select('id, username, text, status, position, updated_at')
      .eq('channel', channel)
      .in('status', ['active', 'backlog', 'done'])
      .gte('updated_at', oneHourAgo)
      .order('updated_at', { ascending: false })
      .limit(50)

    if (!data) return

    const rows = data as Task[]
    const map = new Map<string, UserTasks>()

    for (const task of rows) {
      if (!map.has(task.username)) {
        map.set(task.username, { username: task.username, active: null, backlog: [], done: [] })
      }
      const entry = map.get(task.username)!
      if (task.status === 'active' && entry.active === null) {
        entry.active = task
      } else if (task.status === 'backlog') {
        entry.backlog.push(task)
      } else if (task.status === 'done') {
        entry.done.push(task)
      }
    }

    userTasks.value = Array.from(map.values()).sort((a, b) => {
      if (a.username === channel) return -1
      if (b.username === channel) return 1
      return a.username.localeCompare(b.username)
    })
  }

  let fetchTimeout: ReturnType<typeof setTimeout> | null = null

  function debouncedFetch() {
    if (fetchTimeout) clearTimeout(fetchTimeout)
    fetchTimeout = setTimeout(() => fetchTasks(), 100)
  }

  onMounted(async () => {
    await fetchTasks()
    supabase
      .channel('tasks-overlay')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tasks', filter: `channel=eq.${channel}` },
        () => fetchTasks()
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status)
      })
  })

  onUnmounted(() => {
    supabase.removeChannel(supabase.channel('tasks-overlay'))
  })

  return { userTasks }
}
