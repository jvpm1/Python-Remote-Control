// Libs
import { createSignal } from "solid-js";

// Components
import { ConnectionComponent } from "./component/connection";
import { unShorten } from "./component/shortener";
import { FooterButton, MouseCompenent, PageCompenent } from "./component/pages";

// Images
import MouseIcon from "./assets/imgs/mouse.svg";
import EmergencyIcon from "./assets/imgs/emergency.svg";

// Signals
const [isConnected, setConnected] = createSignal(true);
const [isConnecting, setConnecting] = createSignal(false);
const [connectionError, setError] = createSignal("");
const [selectedPage, setPage] = createSignal(-1);

// Misc
let currentWebSocket!: WebSocket | null;
let connectContainerRef!: HTMLParagraphElement;

// Functions
const onPageButtonPress = (pageNumber: number) => {
  if (selectedPage() == pageNumber) {
    setPage(-1);
    return;
  }

  setPage(pageNumber);
};

const abort = () => {
  if (currentWebSocket) {
    currentWebSocket.close();
    currentWebSocket = null;
  }
  setConnected(false);
  setConnecting(false);
};

const connectFunction = async (button: any, textbox: any): Promise<void> => {
  try {
    const connectionCode: string = "2tx04n"; //textbox.value;

    // Mistake checking
    const isTooShort = connectionCode.length <= 4;
    if (isTooShort) {
      setError("Too short code!");
      return;
    }

    // Connecting to proxy
    let ip: string = unShorten(connectionCode);
    const websocket: WebSocket = new WebSocket(`ws://${ip}:6969`);

    setConnecting(true);

    websocket.onopen = () => {
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

    currentWebSocket = websocket;
  } catch (err) {
    abort();

    setError(`Internal error: ${err}`);
  }
};

const App = () => {
  return (
    <div class="relative h-screen w-screen bg-neutral-900 flex flex-col justify-between">
      <section
        ref={connectContainerRef}
        class={`transition-opacity duration-500 ${
          isConnected() ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
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

      <main class="w-full">
        <PageCompenent
          pageNumber={0}
          selectedPage={selectedPage}
          component={<MouseCompenent />}
        />
      </main>

      <footer class="flex flex-row items-center bg-neutral-800 justify-center gap-10 rounded-t-3xl text-md text-gray-300">
        <FooterButton
          name="Mouse"
          icon={MouseIcon}
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
      </footer>
    </div>
  );
};

export default App;
