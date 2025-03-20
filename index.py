import socket
import threading
import json
import signal
import sys
import tkinter as tk
from tkinter import messagebox

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
    except:
        return None    
    
class Host:
    def __init__(self):
        
        self.port = 6969
        self.ip = get_ip()
        self.ip_code = get_ip_code(self.ip)

        self.running = False
        self.closing = False

        self.host_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.host_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.broadcast_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.broadcast_socket.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)

    def close(self):
        """Handles closing"""
        
        if self.closing:
            return
        self.closing = True

        print("Shutting down...")
        
        self.running = False
        try:
            self.host_socket.close()
        except:
            pass

    def start(self):
        # Ctrl + C Closing handler
        signal.signal(signal.SIGINT, lambda sig, frame: self.close())
        
        try:
            self.host_socket.bind(('0.0.0.0', self.port))
            self.host_socket.listen(5)

            msg("Info", f"Connection code: {self.ip_code}")
            print(f"Running | port={self.port}, ip={self.ip}")
    
            self.running = True
            self.handle_connections()
            
        except Exception as err:
            print(f"Error whilst starting host: {err}")
            self.close()

    def handle_client(self, client_socket, client_address):
        """Processes the data given by the clients"""
        try: 
            while self.running:
                try:
                    data = client_socket.recv(4096)
                    if not data:
                        break
                
                    try: 
                        json_data = json.loads(data.decode('utf-8'))
                        print(f"Received data from {client_address}")
                    except json.JSONDecodeError:
                        print(f"{client_address} sent invalid JSON")
                except:
                    pass
        finally:
            client_socket.close()
            print(f"Connection closed with {client_address}")

    def handle_connections(self):
        """Handles the new clients that are connecting"""
        try:
            while self.running:
                try:
                    self.host_socket.settimeout(1.0)
                    client_socket, client_address = self.host_socket.accept()

                    print(f"New connection from {client_address}")

                    client_thread = threading.Thread(
                        target=self.handle_client,
                        args=(client_socket, client_address)
                    )
                    client_thread.daemon = True
                    client_thread.start()
                except socket.timeout:
                    continue
        finally:
            self.close()
    
    

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "client":
        pass
    else:
        host = Host()
        host.start()