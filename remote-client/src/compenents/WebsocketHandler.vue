<!-- WebsocketHandler.vue -->
<script lang="ts" setup>
import { onMounted, ref, type Ref, onBeforeUnmount, nextTick } from "vue";
import { connectSocket } from "../assets/modules/socket";
import { getCommands, type Commands } from "../assets/modules/command";

const code: Ref<string> = ref("");
const errorDisplay: Ref<string | null> = ref(null);
const inputCode: Ref<HTMLInputElement | null> = ref(null);
const isConnected = ref(false);
const isLoading = ref(false);

let currentWebSocket: WebSocket | null = null;

const abort = (message: string | null) => {
  try {
    if (currentWebSocket) {
      currentWebSocket.close();
    }

    isConnected.value = false;
    isLoading.value = false;

    errorDisplay.value = message || null;
  } catch (err) {
    errorDisplay.value = "Error whilst aborting";
    console.error("Abort error:", err);
  }
};

const connect = async (): Promise<void> => {
  try {
    if (currentWebSocket) {
      currentWebSocket.close();
    }

    const shortendCode: string | any = code.value || "";
    const websocket: WebSocket = await connectSocket(shortendCode);

    currentWebSocket = websocket;
    errorDisplay.value = null;
    isLoading.value = true;

    websocket.onopen = () => {
      console.log("Connected");

      isConnected.value = false;
      isLoading.value = false;
    };

    websocket.onclose = () => {
      console.log("Closed");
      abort("Connection closed");
    };

    websocket.onerror = (err: any) => {
      abort(`Couldn't connect to websocket: ${err.currentTarget.url}`);
    };

    inputCode.value?.blur();
  } catch (err) {
    abort("Error whilst running websocket");
  }
};

const assignCommandEvents = async (): Promise<void> => {
  try {
    const commands = await getCommands();

    commands.buttons.forEach((args: Commands) => {
      args.element.addEventListener("click", () => {
        console.log("e");

        if (!isConnected.value || !currentWebSocket) {
          return;
        }

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
    class="absolute w-full h-full flex flex-col items-center justify-center gap-5 z-150 bg-white/10 backdrop-blur-sm"
  >
    <img
      src="../assets/images/arrow-clockwise.svg"
      alt=""
      class="w-10 animate-spin"
    />
    <button
      class="bg-white p-2 px-5 rounded-2xl font-bold text-gray-600"
      v-on:click="abort(null)"
    >
      Abort
    </button>
  </div>
  <!-- Connect code -->
  <div
    id="connect-code-overlay"
    :class="{
      'opacity-0 pointer-events-none invisible': isConnected,
      'opacity-100 pointer-events-auto visible': !isConnected,
    }"
    class="absolute w-screen h-screen bg-black/25 backdrop-blur space-y-5 z-50 flex flex-col justify-center items-center transition-opacity duration-800"
  >
    <input
      type="text"
      ref="inputCode"
      placeholder="Enter code"
      class="w-5/8 h-14 bg-white font-bold text-center text-xl rounded-2xl outline-none focus:scale-105 transition-all ease-in-out"
      v-model="code"
      @keyup.enter="connect"
    />
    <div
      v-if="errorDisplay != null"
      class="w-10/11 p-5 bg-white rounded-2xl font-bold text-gray-700"
    >
      {{ errorDisplay }}
    </div>
  </div>
</template>
