<template>
  <main class="overlay" aria-label="Stream overlay">

    <!-- ── Pomodoro panel ── -->
    <section class="panel" aria-label="Pomodoro timer">
      <header class="panel__header">
        <span class="panel__title">Focus Timer</span>
        <span v-if="pomo.active" class="pomo__phase" :aria-label="`${pomo.phase} phase`">
          {{ pomo.phase === 'work' ? '💪 Work' : '☕ Break' }}
        </span>
      </header>
      <div class="panel__body">
        <div class="pomo" :class="{ 'pomo--idle': !pomo.active }">
          <span class="pomo__time" aria-live="polite">
            {{ pomo.active ? pomo.timeDisplay : 'No timer running' }}
          </span>
          <div
            class="pomo__bar-wrap"
            role="progressbar"
            aria-label="Pomodoro timer progress"
            :aria-valuenow="Math.round(pomo.progressPct)"
            aria-valuemin="0"
            aria-valuemax="100">
            <div
              class="pomo__bar"
              :class="{ 'pomo__bar--break': pomo.phase === 'break' }"
              :style="{ width: pomo.progressPct + '%' }" />
          </div>
        </div>
      </div>
    </section>

    <!-- ── Task list panel ── -->
    <section class="panel" aria-label="Task list">
      <header class="panel__header">
        <span class="panel__title">Co-working Tasks</span>
        <span class="panel__title" aria-label="Number of active chatters">{{ userTasks.length }}
          working</span>
      </header>
      <div class="panel__body">
        <p v-if="userTasks.length === 0" class="tasks__empty">
          No tasks yet — type !task in chat to add one!
        </p>
        <ul v-else class="task-group" role="list">
          <li
            v-for="user in userTasks"
            :key="user.username"
            class="task-group">
            <ul role="list">
              <li v-if="user.active" class="task-item task-item--active" role="listitem">
                <span class="task-item__dot task-item__dot--active" aria-hidden="true" />
                <span class="task-item__text">
                  <span class="task-item__username">{{ user.username }}:</span> {{ user.active.text
                  }}
                </span>
              </li>
              <li
                v-for="(task, index) in user.backlog.slice(0, 5)"
                :key="task.id"
                class="task-item task-item--backlog"
                role="listitem">
                <span class="task-item__number" aria-hidden="true">{{ index + 1 }}</span>
                <span class="task-item__text">
                  <span class="task-item__username">{{ user.username }}:</span> {{ task.text }}
                </span>
              </li>
              <li
                v-for="task in user.done.slice(0, 10)"
                :key="task.id"
                class="task-item task-item--done"
                role="listitem">
                <span class="task-item__dot task-item__dot--done" aria-hidden="true" />
                <span class="task-item__text">
                  <span class="task-item__username">{{ user.username }}:</span> <span
                    class="task-item__done-text">{{ task.text }}</span>
                </span>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </section>

    <!-- ── Commands panel ── -->
    <section class="panel" aria-label="Available commands">
      <header class="panel__header">
        <span class="panel__title">Commands</span>
      </header>
      <div class="panel__body">
        <div class="commands">
          <div class="commands__group">
            <span class="commands__label">Tasks</span>
            <span class="commands__list">!task • !later • !soon • !done • !done next • !remove <br>
              !rename • !mydone</span>
          </div>
          <div class="commands__group">
            <span class="commands__label">Timer</span>
            <span class="commands__list">!pomo start &lt;work&gt; &lt;break&gt; • !pomo • !pomo
              stop</span>
          </div>
          <div class="commands__group">
            <span class="commands__label">Wellness</span>
            <span class="commands__list">!hype • !hydrate • !stand • !vibe</span>
          </div>
        </div>
      </div>
    </section>

  </main>
</template>

<script setup lang="ts">
const { userTasks } = useTasks('toddcodes')
const { state: pomoState } = usePomo('toddcodes')
const pomo = computed(() => pomoState.value)
</script>