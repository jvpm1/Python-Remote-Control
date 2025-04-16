// Libs
import { createSignal } from "solid-js";

// Components
import { ConnectionComponent } from "./component/connection";
import { unShorten } from "./modules/util/shortener";
import { FooterButton } from "./component/layout/FooterButton";
import {
  MouseComponent,
  PageComponent,
  AnnoyancesComponent,
} from "./component/pages";

// Images
import LogoutIcon from "./assets/imgs/logout.svg";
import TouchPadIcon from "./assets/imgs/touchpad.svg";
import EmergencyIcon from "./assets/imgs/emergency.svg";

// Signals
const [isConnected, setConnected] = createSignal(false);
const [isConnecting, setConnecting] = createSignal(false);
const [connectionError, setError] = createSignal("");
const [selectedPage, setPage] = createSignal(0);

// Misc
let currentWebSocket!: WebSocket | null;
let connectContainerRef!: HTMLParagraphElement;

// Functions
const onPageButtonPress = (pageNumber: number) => {
  if (selectedPage() == pageNumber) {
    // setPage(-1);
    return;
  }

  setPage(pageNumber);
};

const abort = async () => {
  if (currentWebSocket) {
    currentWebSocket.close();
    currentWebSocket = null;
  }
  setConnected(false);
  setConnecting(false);
  document.exitFullscreen();
};

const connectFunction = (button: any, textbox: any) => {
  try {
    const connectionCode: string = textbox.value || "2tx04n";

    // Mistake checking
    const isTooShort = connectionCode.length <= 3;
    if (isTooShort) {
      setError("The connection code is invalid.");
      return;
    }

    // Connecting to proxy
    let ip: string = unShorten(connectionCode);
    const websocket: WebSocket = new WebSocket(`ws://${ip}:6969`);

    setError("");
    setConnecting(true);

    websocket.onopen = () => {
      document.body.requestFullscreen();

      setConnecting(false);
      setConnected(true);
    };

    websocket.onerror = (event) => {
      console.error("WebSocket error:", event);
      if (currentWebSocket) {
        setError(
          "Connection failed. Please double check the code and try again."
        );
        abort();
      }
    };

    websocket.onclose = () => {
      if (connectionError() == "") {
        setError("Connection closed.");
      }

      abort();
    };

    currentWebSocket = websocket;
  } catch (err) {
    abort();

    setError(`Internal error: ${err}`);
  }
};

const sendCommand = (type: string, data: Record<string, any>) => {
  try {
    if (currentWebSocket == null || !isConnected()) {
      return;
    }

    currentWebSocket.send(
      JSON.stringify({
        type: type,
        data: data,
      })
    );
  } catch (err) {
    console.log("sendCommand: " + err);
  }
};

const App = () => {
  return (
    <div class="relative h-screen w-screen bg-neutral-900 flex flex-col justify-between">
      <section
        ref={connectContainerRef}
        class={isConnected() ? "hidden" : "visible"}
      >
        <ConnectionComponent
          isConnected={isConnected}
          setConnected={setConnected}
          isConnecting={isConnecting}
          setConnecting={setConnecting}
          connectFunction={connectFunction}
          connectionError={connectionError}
          abort={abort}
        />
      </section>

      <main class="w-full h-full no-scroll overflow-y-scroll">
        <PageComponent
          pageNumber={0}
          selectedPage={selectedPage}
          component={<MouseComponent sendCommand={sendCommand} />}
        />
        <PageComponent
          pageNumber={1}
          selectedPage={selectedPage}
          component={<AnnoyancesComponent sendCommand={sendCommand} />}
        />
      </main>

      <footer class="grid grid-cols-3 bg-neutral-800 rounded-t-3xl text-md text-gray-300">
        <div class="flex items-center p-4">
          <button
            class="cursor-pointer p-2"
            onclick={() => {
              abort();
              setError("Connection closed by client.");
            }}
          >
            <img src={LogoutIcon} alt="" class="h-" />
          </button>
        </div>

        <div class="flex flex-row items-center justify-center gap-4">
          <FooterButton
            name="Touchpad"
            icon={TouchPadIcon}
            selectedPage={selectedPage}
            onPageButtonPress={onPageButtonPress}
            pageNumber={0}
          />
          <FooterButton
            name="Annoyances"
            icon={EmergencyIcon}
            selectedPage={selectedPage}
            onPageButtonPress={onPageButtonPress}
            pageNumber={1}
          />
        </div>
      </footer>
    </div>
  );
};

export default App;
