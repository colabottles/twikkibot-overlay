import { ref, onMounted, onUnmounted } from 'vue'
import { useSupabase } from './useSupabase'

interface Timer {
  id: string
  channel: string
  phase: 'work' | 'break'
  work_minutes: number
  break_minutes: number
  started_at: string
  phase_ends_at: string
  active: boolean
}

export interface PomoState {
  active: boolean
  phase: 'work' | 'break'
  workMinutes: number
  breakMinutes: number
  phaseEndsAt: Date | null
  timeDisplay: string
  progressPct: number
}

export function usePomo(channel: string) {
  const supabase = useSupabase()

  const state = ref<PomoState>({
    active: false,
    phase: 'work',
    workMinutes: 25,
    breakMinutes: 5,
    phaseEndsAt: null,
    timeDisplay: '',
    progressPct: 0,
  })

  let tickInterval: ReturnType<typeof setInterval> | null = null

  function tick() {
    if (!state.value.active || !state.value.phaseEndsAt) return

    const remaining = state.value.phaseEndsAt.getTime() - Date.now()

    if (remaining <= 0) {
      state.value.timeDisplay = '0:00'
      state.value.progressPct = 0
      return
    }

    const totalMs =
      (state.value.phase === 'work'
        ? state.value.workMinutes
        : state.value.breakMinutes) *
      60 *
      1000

    const mins = Math.floor(remaining / 60000)
    const secs = Math.floor((remaining % 60000) / 1000)
    state.value.timeDisplay = `${mins}:${secs.toString().padStart(2, '0')}`
    state.value.progressPct = Math.min(100, (remaining / totalMs) * 100)
  }

  async function fetchTimer() {
    const { data } = await supabase
      .from('timers')
      .select('*')
      .eq('channel', channel)
      .eq('active', true)
      .limit(1)

    const timer = data?.[0] as Timer | undefined

    if (!timer) {
      state.value.active = false
      state.value.timeDisplay = ''
      return
    }

    state.value.active = true
    state.value.phase = timer.phase
    state.value.workMinutes = timer.work_minutes
    state.value.breakMinutes = timer.break_minutes
    state.value.phaseEndsAt = new Date(timer.phase_ends_at)
    tick()
  }

  onMounted(async () => {
    await fetchTimer()
    tickInterval = setInterval(tick, 1000)

    supabase
      .channel('timers-overlay')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'timers', filter: `channel=eq.${channel}` },
        () => fetchTimer()
      )
      .subscribe()
  })

  onUnmounted(() => {
    if (tickInterval) clearInterval(tickInterval)
  })

  return { state }
}