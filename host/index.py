from tkinter import messagebox
import websockets
import pyautogui
import threading
import socket
import random
import json
import win32api
import win32con
import asyncio
import pygame
import ctypes
import base64
import tempfile
import os

pyautogui.FAILSAFE = False

PORT = 6969
TOGGLES = {
    "seizure": False,
}

def play_sound(sound_file):
    try:
        pygame.mixer.Sound(sound_file).play()
    except Exception as err:
        print(f"Error playing sound: {err}")

def move_mouse(x, y):
    pyautogui.move(
        x,
        y,
    )


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
            random.randint(-50, 50),
            random.randint(-50, 50)
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

            mouse_thread = threading.Thread(target=move_mouse, args=(x, y))
            mouse_thread.start()
        elif type == "playsound":
            sound_file = data.get("file", "")

            if sound_file:
                play_sound(sound_file)
        elif type == "mouseclick":
            pyautogui.click(button=data.get("button", "right"))
        elif type == "toggle":
            name = data.get("name", "")
            toggle = data.get("toggle", False)
            
            TOGGLES[name] = toggle
        elif type == "rotate":
            orientation = data.get("orientation", 0)
            
            device = win32api.EnumDisplayDevices(None, 0)
            data = win32api.EnumDisplaySettings(device.DeviceName, win32con.ENUM_CURRENT_SETTINGS)
            data.DisplayOrientation = orientation
            win32api.ChangeDisplaySettingsEx(device.DeviceName, data, 0)
        elif type == "background":
            base64_string = data.get("base64", False)
            if base64_string:
                image64 = base64.b64decode(base64_string)
                
                temp_dir = tempfile.gettempdir()
                
                image_path = os.path.join(temp_dir, "background.jpg")
                
                with open(image_path, "wb") as f:
                    f.write(image64)
                
                ctypes.windll.user32.SystemParametersInfoW(20, 0, image_path, 3)
            
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

                    print(f"Received data from {client_info}: {data}")

                    try:
                        self.run_command(data)
                    except Exception as err:
                        print(f"Something went wrong whilst runing command: {err}")
                        
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
        msg("Server started!", f"Connection code: {code}")

        try:
            while self.running:
                await asyncio.sleep(0.01)
                toggles_check()
        except asyncio.CancelledError:
            self.stop()

async def main():
    server = Server()

    pygame.mixer.init()

    try:
        await server.start()
    except KeyboardInterrupt:
        print("Keyboard interrupt received")
    except Exception as err:
        print(f"Something went wrong: {err}")

if __name__ == "__main__":
    asyncio.run(main())
