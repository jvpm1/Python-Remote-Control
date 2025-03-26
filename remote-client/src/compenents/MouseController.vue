<!-- MouseController.vue -->
<script setup lang="ts"></script>

<template>
  <div class="flex flex-col justify-between h-full w-full gap-5 p-5">
    <button class="socket-event-button mouse-btn" id="up">↑</button>

    <div class="flex flex-row w-full h-full justify-between gap-5">
      <button class="socket-event-button mouse-btn" id="left">←</button>
      <button class="socket-event-button mouse-btn" id="click">Click</button>
      <button class="socket-event-button mouse-btn" id="right">→</button>
    </div>

    <button class="socket-event-button mouse-btn" id="down">↓</button>
  </div>
</template>

<style scoped>
.mouse-btn {
  width: 100%;
  height: 100%;

  border: 1px solid rgb(200, 200, 200);
  border-radius: 6px;

  font-size: 5vw;
}
</style>
