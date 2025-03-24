<script lang="ts" setup>
import { onMounted, ref, type Ref, onBeforeUnmount, nextTick } from "vue";
import { connectSocket } from "../assets/modules/socket";
import { getCommands, type Commands } from "../assets/modules/command";

const code: Ref<string> = ref("");
const inputCode: Ref<HTMLInputElement | null> = ref(null);
const isConnected = ref(false);
const isLoading = ref(false);

let currentWebSocket: WebSocket | null = null;

const connect = async (): Promise<void> => {
  try {
    if (currentWebSocket) {
      currentWebSocket.close();
    }

    const shortendCode: string | any = code.value || "";
    const websocket: WebSocket = await connectSocket(shortendCode);

    currentWebSocket = websocket;
    isLoading.value = true;

    websocket.onopen = () => {
      console.log("Connected");
      isConnected.value = true;
      isLoading.value = false;
    };

    websocket.onclose = () => {
      console.log("Closed");
      isConnected.value = false;
      isLoading.value = false;
    };

    websocket.onerror = (err) => {
      console.error("WebSocket error:", err);
      isConnected.value = false;
      isLoading.value = false;
    };

    setTimeout(() => {
      console.log("eee");
      if (isLoading.value && !isConnected && websocket) {
        isLoading.value = false;
        websocket.close();
        currentWebSocket = null;
      }
    }, 1000);

    inputCode.value?.blur();
  } catch (error) {
    console.error("Connection error:", error);
    isConnected.value = false;
    isLoading.value = false;
  }
};

const assignCommandEvents = async (): Promise<void> => {
  try {
    const commands = await getCommands();
    console.log(commands);
    commands.buttons.forEach((args: Commands) => {
      args.element.addEventListener("click", () => {
        console.log("e");

        if (!isConnected.value || !currentWebSocket) {
          return;
        }
        console.log("2e");

        currentWebSocket.send(
          JSON.stringify({
            type: args.type,
            data: {},
            // tick: Date.now(),
          })
        );
      });
    });

    commands.toggles.forEach((args: Commands) => {
      args.element.addEventListener("change", (event: Event) => {
        if (!isConnected.value || !currentWebSocket) {
          return;
        }

        const target = event.target as HTMLInputElement;
        currentWebSocket.send(
          JSON.stringify({
            type: args.type,
            data: { value: target.checked },
            timestamp: Date.now(),
          })
        );
      });
    });
  } catch (error) {
    console.error("Error with command event:", error);
  }
};

const init = async (): Promise<void> => {
  await nextTick();
  setTimeout(() => {
    assignCommandEvents();
  }, 500);
};

onBeforeUnmount(() => {
  if (currentWebSocket) {
    currentWebSocket.close();
  }
});

onMounted(() => {
  init();
});
</script>
<template>
  <!-- Loading overlay -->
  <div
    v-if="isLoading"
    id="loading-overlay"
    class="absolute w-full h-full flex justify-center z-150 bg-white/50"
  >
    <img
      src="../assets/images/arrow-clockwise.svg"
      alt=""
      class="w-10 animate-spin"
    />
  </div>
  <!-- Connect code -->
  <div
    id="connect-code-overlay"
    :class="{
      'opacity-0 pointer-events-none invisible': isConnected,
      'opacity-100 pointer-events-auto visible': !isConnected,
    }"
    class="absolute w-screen h-screen bg-black/25 backdrop-blur z-50 flex flex-col justify-center items-center transition-all duration-800"
  >
    <input
      type="text"
      ref="inputCode"
      placeholder="Enter code"
      class="w-5/8 h-14 bg-white font-bold text-center text-xl rounded-2xl outline-none focus:scale-105 transition-all ease-in-out"
      v-model="code"
      @keyup.enter="connect"
    />
  </div>
</template>
