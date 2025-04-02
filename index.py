import websockets
import pyautogui
import threading
import socket
import random
import json
import signal
import sys
import tkinter as tk
from tkinter import messagebox
import asyncio
import zlib

pyautogui.FAILSAFE = False

PORT = 6969
TOGGLES = {
    "seizure": False,
}

def shorten_ip(ip):
    # Made possible by Claude
    split = ip.split(".")
    if len(split) != 4:
        raise ValueError("Invalid ip length")

    num = 0
    for value in split:
        num = num * 256 + int(value)

    chars = "0123456789abcdefghijklmnopqrstuvwxyz"
    result = ""
    while num > 0:
        result = chars[num % 36] + result
        num //= 36

    return result or "0"

def msg(title="", message=""):
    """Popup"""
    messagebox.showinfo(title, message)

def get_ip():
    try:
        temp_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        temp_socket.connect(("8.8.8.8", 80))
        ip = temp_socket.getsockname()[0]
        temp_socket.close()
        return ip
    except Exception:
        return "127.0.0.1"

def get_ip_code(ip):
    try:
        split = ip.split(".")
        return int(split[-1])
    except Exception:
        return None    

def toggles_check():
    if TOGGLES.get("seizure"):
        pyautogui.move(
            random.randint(-100, 100),
            random.randint(-100, 100)
        )

class Server:
    def __init__(self):  
        self.ip = get_ip()
        self.ip_code = get_ip_code(self.ip)
        self.server = None
        self.running = False

    def stop(self):
        """Handles closing"""
        if self.server:
            print("Shutting down...")
            self.running = False
            self.server.close()

    def run_command(self, response):
        """
        Json data example:
        {
            type: <string>
            value: <any>
        }
        """

        type = response.get("type", "")   
        data = response.get("data", {})

        if type == "movemouse":
            x, y  = data.get("x", 0), data.get("y", 0)

            pyautogui.move(
                x,
                y,
            )
        elif type == "mouseclick":
            pyautogui.click(button=data.get("button", "right"))
        elif type == "toggle":
            name = data.get("name", "")
            toggle = data.get("toggle", False)
            TOGGLES[name] = toggle


    async def on_client_event(self, websocket):
        """
        Handles client connection

        Json data example:
        {
            type: <string>
            value: <any>
        }
        """
        client_info = websocket.remote_address
        print(f"New connection from {client_info}")

        try:
            async for msg in websocket:
                try: 
                    data = json.loads(msg)
                    self.run_command(data)
                    print(f"Received data from {client_info}: {data}")
                except json.JSONDecodeError:
                    print(f"Invalid json from {client_info}")
        except websockets.exceptions.ConnectionClosed:
            print(f"Connection closed with {client_info}")

    async def start(self):
        self.running = True
        self.server = await websockets.serve(
            self.on_client_event,
            "0.0.0.0",
            PORT
        )

        code = shorten_ip(self.ip)

        print(f"WebSocket server running | port={PORT}, ip={self.ip}, code={code}")

        try:
            while self.running:
                await asyncio.sleep(0.1)
                toggles_check()
        except asyncio.CancelledError:
            self.stop()

async def main():
    server = Server()

    try: 
        await server.start()
    except KeyboardInterrupt:
        print("Keyboard interrupt received")
    except Exception as err:
        print(f"Something went wrong: {err}")

if __name__ == "__main__":
    asyncio.run(main())
