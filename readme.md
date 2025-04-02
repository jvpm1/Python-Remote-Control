# WebSocket Remote Control

A system for remotely controlling your computer functions using WebSockets. This project uses Python as the host and Vue.js as the client.

## Features

- Control mouse movements remotely
- Simple connection code system
- Responsive Vue.js web interface
- Multi clients support

## How to run?

### Server Requirements

- Python 3.7+
- Required Python packages:
  ```
  pip install websockets pyautogui
  ```

### Client Requirements

- Browser (Chrome, Brave, Firefox or librewolf)

### Installing

1. Go to the releases on github and download both server.py and client.html
2. Run the python script:

   ```
   python server.py
   ```

3. The server will display connection information:

   ```
   WebSocket server running | port=6969, ip=x.x.x.x, code=2tx04n
   ```

4. Note the connection code (e.g., `2tx04n`) for connecting with the client.

### Connect to host with the client

1. Open the client.html in your web browser:

2. Enter the connection code displayed by the server.

3. Once connected, use the interface to control the host computer.

## Connection visualization

![logic](./assets/images/logic.jpg)

## Image preview

### Client new (Code, Mouse Control)

On the client you can put in the code provided to connect to the host.

![code](./assets/images/clientPreviewCode.png)

At the bottom you'll see different icons and that'll be your tabs.
![mouse](./assets/images/clientPreviewMouse.png)

![annoy](./assets/images/clientPreviewAnnoy.png)

### Server new (Terminal)

The server will create a websocket on the port 6969 and will also provide the code in the terminal.

![server](/assets/images/serverPreview.png)

### Old Version

![codeOld](/assets/images/clientPreviewCodeOld.png)
![codeOld](/assets/images/clientPreviewMouseOld.png)
