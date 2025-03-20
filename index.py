import websockets
import pyautogui
import threading
import socket
import json
import signal
import sys
import tkinter as tk
from tkinter import messagebox
import asyncio

PORT = 6969

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
    
class Server:
    def __init__(self):  
        self.ip = get_ip()
        self.ip_code = get_ip_code(self.ip)
        self.server = None

    def stop(self):
        """Handles closing"""
        if self.server:
            print("Shutting down...")
            self.server.close()
        
    def run_command(self, response):
        type = response.get("type", "")   
        data = response.get("data", {})

        if type == "move_mouse":
            current_x, current_y = pyautogui.position()
            direction = data.get("direction", {})

            pyautogui.moveTo(
                current_x - direction.get("x", 0),
                current_y - direction.get("y", 0)
            )
        elif type == "click":
            pyautogui.click()
            
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
        self.server = await websockets.serve(
            self.on_client_event,
            "0.0.0.0",
            PORT
        )

        print(f"WebSocket server running | port={PORT}, ip={self.ip}, code={self.ip_code}")

        await self.server.wait_closed()

async def main():
    server = Server()
    try: 
        await server.start()
    except Exception as err:
        print(f"Something wen't wrong upon starting the server: {err}")

if __name__ == "__main__":
    asyncio.run(main())