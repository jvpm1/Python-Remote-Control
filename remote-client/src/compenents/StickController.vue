<!-- MouseController.vue -->
<script setup lang="ts">
import { onMounted, ref, onBeforeUnmount } from "vue";

const stickContainer = ref<HTMLElement | null>(null);
const stick = ref<HTMLElement | null>(null);
const position = ref<{ x: number; y: number }>({ x: 0, y: 0 });

let isActive = false;
const stickSize = 24;

const centerStick = (): void => {
  position.value = { x: 0, y: 0 };
  updateStickPosition();
};

const updateStickPosition = (): void => {
  if (!stickContainer.value || !stick.value) return;

  const container = stickContainer.value;
  const stickElement = stick.value;

  const centerX = container.offsetWidth / 2;
  const centerY = container.offsetHeight / 2;

  const stickX = centerX + position.value.x - stickElement.offsetWidth / 2;
  const stickY = centerY + position.value.y - stickElement.offsetHeight / 2;

  stickElement.style.transform = `translate(${stickX}px, ${stickY}px)`;

  console.log(`X: ${position.value.x}, Y: ${position.value.y}`);
};

const handleMouseMove = (event: MouseEvent): void => {
  if (!isActive || !stickContainer.value) return;

  const container = stickContainer.value;
  const rect = container.getBoundingClientRect();

  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  const x = event.clientX - rect.left - centerX;
  const y = event.clientY - rect.top - centerY;

  const radius = Math.min(rect.width, rect.height) / 2 - stickSize;

  const magnitude = Math.sqrt(x * x + y * y);

  if (magnitude > radius) {
    // I love math >:(
    const angle = Math.atan2(y, x);
    position.value = {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  } else {
    position.value = { x, y };
  }

  updateStickPosition();
};

const onMouseDown = (event: MouseEvent): void => {
  isActive = true;
  handleMouseMove(event);

  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", onMouseUp);
};

const onMouseUp = (): void => {
  isActive = false;
  centerStick();

  document.removeEventListener("mousemove", handleMouseMove);
  document.removeEventListener("mouseup", onMouseUp);
};

onMounted(() => {
  centerStick();
});

onBeforeUnmount(() => {
  document.removeEventListener("mousemove", handleMouseMove);
  document.removeEventListener("mouseup", onMouseUp);
});
</script>

<template>
  <div class="w-full h-full flex justify-center items-center">
    <div
      ref="stickContainer"
      id="stick-container"
      class="border-4 rounded-full w-64 h-64 lg:h-92 lg:w-92 relative"
      @mousedown="onMouseDown"
    >
      <div
        ref="stick"
        id="stick"
        class="bg-black rounded-full w-12 h-12 absolute"
      ></div>
    </div>
  </div>
</template>
