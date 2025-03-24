<script setup lang="ts">
import { ref, defineAsyncComponent } from "vue";
import MouseIcon from "./assets/images/mouse.svg";
import WebsocketHandler from "./compenents/WebsocketHandler.vue";

const MouseController = defineAsyncComponent(
  () => import("./compenents/MouseController.vue")
);

const activePageIndex = ref(null);

const pages = [
  {
    name: "Mouse Controller",
    component: MouseController,
    image: MouseIcon,
  },
];

const toggleComponent = (index: any) => {
  activePageIndex.value = activePageIndex.value === index ? null : index;
};
</script>

<template>
  <WebsocketHandler />

  <!-- Main container -->
  <div id="main-container" class="w-screen h-screen flex flex-col">
    <main class="h-full relative overflow-hidden">
      <!-- Pages -->
      <div
        v-for="(page, index) in pages"
        :key="index"
        class="w-full h-full absolute top-0 left-0"
      >
        <component
          :is="page.component"
          :class="{
            'opacity-100 pointer-events-auto visible':
              activePageIndex === index,
            'opacity-0 scale-150 pointer-events-none invisible':
              activePageIndex !== index,
          }"
          class="w-full h-full transition-all duration-300"
        />
      </div>

      <div
        class="flex items-center justify-center h-full transition-opacity duration-100"
        :class="{
          'opacity-100': activePageIndex === null,
          'opacity-0 pointer-events-none': activePageIndex !== null,
        }"
      >
        <p>:)</p>
      </div>
    </main>

    <footer class="p-5">
      <!-- Pages tabs -->
      <div class="flex justify-center gap-10">
        <button
          v-for="(page, index) in pages"
          :key="index"
          @click="toggleComponent(index)"
          :class="{ 'border-black/65': activePageIndex === index }"
          class="border-2 border-black/25 p-2 rounded-full transition-all hover:scale-105"
        >
          <img :src="page.image" alt="Icon" class="w-12 h-12" />
        </button>
      </div>
    </footer>
  </div>
</template>

<style scoped>
* {
  font-family: Arial, Helvetica, sans-serif;
}
</style>
