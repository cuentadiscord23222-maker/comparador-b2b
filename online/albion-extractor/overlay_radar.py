import tkinter as tk
import math
import socket
import threading
import json
import time

# Configurations
UDP_IP = "127.0.0.1"
UDP_PORT = 5555
WINDOW_SIZE = 300  # Width and height of the radar window
RADAR_RADIUS = WINDOW_SIZE // 2
CENTER_X = RADAR_RADIUS
CENTER_Y = RADAR_RADIUS
SCALE = 2.0  # Pixels per meter/unit
TIMEOUT_LIMIT = 3.0  # Remove items not updated in 3 seconds

class RadarOverlay:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("Albion Radar Overlay")
        
        # Borderless, always-on-top
        self.root.overrideredirect(True)
        self.root.attributes("-topmost", True)
        
        # Position in the top-left corner
        self.root.geometry(f"{WINDOW_SIZE}x{WINDOW_SIZE}+10+10")
        
        # Make the window transparent (using black as transparent color)
        # Using a very dark color for the window background, and keying transparency to that color
        trans_color = "#010101"
        self.root.config(bg=trans_color)
        self.root.attributes("-transparentcolor", trans_color)
        
        # Dragging variables
        self.drag_start_x = 0
        self.drag_start_y = 0
        
        # Canvas
        self.canvas = tk.Canvas(
            self.root, 
            width=WINDOW_SIZE, 
            height=WINDOW_SIZE, 
            bg=trans_color, 
            highlightthickness=0
        )
        self.canvas.pack()
        
        # Allow dragging the window when holding left click on the radar edge/canvas
        self.canvas.bind("<Button-1>", self.start_drag)
        self.canvas.bind("<B1-Motion>", self.drag)
        
        # Data storage
        # entities: { id: { "x": relative_x, "y": relative_y, "type": type, "timestamp": timestamp } }
        self.entities = {}
        self.lock = threading.Lock()
        
        # Radar sweep variables
        self.sweep_angle = 0
        self.sweep_line = None
        
        # Draw permanent radar elements
        self.draw_static_grid()
        
        # Start background UDP listener
        self.running = True
        self.udp_thread = threading.Thread(target=self.udp_listener, daemon=True)
        self.udp_thread.start()
        
        # Start animations and update loops
        self.animate_sweep()
        self.update_radar_dots()
        
        # Bind keyboard shortcuts
        # Press ESC to exit
        self.root.bind("<Escape>", lambda e: self.close())
        
    def start_drag(self, event):
        self.drag_start_x = event.x
        self.drag_start_y = event.y

    def drag(self, event):
        x = self.root.winfo_x() + (event.x - self.drag_start_x)
        y = self.root.winfo_y() + (event.y - self.drag_start_y)
        self.root.geometry(f"+{x}+{y}")

    def draw_static_grid(self):
        # Outer circle
        self.canvas.create_oval(
            10, 10, WINDOW_SIZE - 10, WINDOW_SIZE - 10,
            outline="#00ff00", width=2, tags="static"
        )
        # Concentric circles
        self.canvas.create_oval(
            RADAR_RADIUS - 50, RADAR_RADIUS - 50,
            RADAR_RADIUS + 50, RADAR_RADIUS + 50,
            outline="#005500", width=1, dash=(3, 3), tags="static"
        )
        self.canvas.create_oval(
            RADAR_RADIUS - 100, RADAR_RADIUS - 100,
            RADAR_RADIUS + 100, RADAR_RADIUS + 100,
            outline="#005500", width=1, dash=(3, 3), tags="static"
        )
        
        # Crosshairs
        self.canvas.create_line(
            RADAR_RADIUS, 10, RADAR_RADIUS, WINDOW_SIZE - 10,
            fill="#005500", width=1, dash=(3, 3), tags="static"
        )
        self.canvas.create_line(
            10, RADAR_RADIUS, WINDOW_SIZE - 10, RADAR_RADIUS,
            fill="#005500", width=1, dash=(3, 3), tags="static"
        )
        
        # Local Player center point
        self.canvas.create_oval(
            CENTER_X - 5, CENTER_Y - 5,
            CENTER_X + 5, CENTER_Y + 5,
            fill="#ffffff", outline="#00ff00", tags="static"
        )

    def animate_sweep(self):
        if not self.running:
            return
            
        # Remove old sweep line
        if self.sweep_line:
            self.canvas.delete(self.sweep_line)
            
        # Calculate endpoint of sweep line
        rad = math.radians(self.sweep_angle)
        end_x = CENTER_X + (RADAR_RADIUS - 10) * math.cos(rad)
        end_y = CENTER_Y + (RADAR_RADIUS - 10) * math.sin(rad)
        
        # Draw sweep line
        self.sweep_line = self.canvas.create_line(
            CENTER_X, CENTER_Y, end_x, end_y,
            fill="#00ff00", width=1.5, stipple="gray50"
        )
        
        # Increment angle
        self.sweep_angle = (self.sweep_angle + 3) % 360
        
        # Schedule next frame
        self.root.after(30, self.animate_sweep)

    def update_radar_dots(self):
        if not self.running:
            return
            
        # Clear dynamic elements (dots)
        self.canvas.delete("dynamic")
        
        now = time.time()
        with self.lock:
            # Filter out timed out entities
            self.entities = {
                k: v for k, v in self.entities.items()
                if now - v["timestamp"] < TIMEOUT_LIMIT
            }
            
            for ent_id, ent in list(self.entities.items()):
                # Coordinates relative to player (x, y)
                # In game coordinates, let's map them to UI
                # Positive Y is up/north, Positive X is right/east
                rel_x = ent["x"] * SCALE
                rel_y = -ent["y"] * SCALE  # invert Y because screen space coords go downwards
                
                # Check if it's within the radar circle limit
                distance = math.sqrt(rel_x**2 + rel_y**2)
                max_radar_dist = RADAR_RADIUS - 15
                
                if distance > max_radar_dist:
                    # Clamp to outer circle
                    angle = math.atan2(rel_y, rel_x)
                    draw_x = CENTER_X + max_radar_dist * math.cos(angle)
                    draw_y = CENTER_Y + max_radar_dist * math.sin(angle)
                else:
                    draw_x = CENTER_X + rel_x
                    draw_y = CENTER_Y + rel_y
                
                # Determine color based on entity type
                ent_type = ent.get("type", "unknown").lower()
                if ent_type == "enemy":
                    color = "#ff0000"  # Red
                elif ent_type == "resource":
                    color = "#00ffff"  # Cyan
                elif ent_type == "ally":
                    color = "#0000ff"  # Blue
                else:
                    color = "#ffff00"  # Yellow
                    
                # Draw the dot
                self.canvas.create_oval(
                    draw_x - 4, draw_y - 4,
                    draw_x + 4, draw_y + 4,
                    fill=color, outline="#ffffff", width=0.5, tags="dynamic"
                )
                
        # Update every 100ms
        self.root.after(100, self.update_radar_dots)

    def udp_listener(self):
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        try:
            sock.bind((UDP_IP, UDP_PORT))
            print(f"UDP Server listening on {UDP_IP}:{UDP_PORT}...")
        except Exception as e:
            print(f"Failed to bind UDP server: {e}")
            return
            
        sock.settimeout(0.5)
        while self.running:
            try:
                data, addr = sock.recvfrom(2048)
                try:
                    payload = json.loads(data.decode("utf-8"))
                    # Expected format:
                    # {
                    #   "entities": [
                    #      {"id": 1, "type": "enemy", "x": 12.5, "y": -4.2},
                    #      {"id": 2, "type": "resource", "x": -22.1, "y": 15.0}
                    #   ]
                    # }
                    now = time.time()
                    with self.lock:
                        if "entities" in payload:
                            for ent in payload["entities"]:
                                ent_id = ent.get("id")
                                if ent_id is not None:
                                    self.entities[ent_id] = {
                                        "x": ent.get("x", 0.0),
                                        "y": ent.get("y", 0.0),
                                        "type": ent.get("type", "unknown"),
                                        "timestamp": now
                                    }
                except json.JSONDecodeError:
                    pass
            except socket.timeout:
                continue
            except Exception as e:
                print(f"UDP error: {e}")
                break
        sock.close()

    def close(self):
        self.running = False
        self.root.destroy()

    def run(self):
        print("Starting Radar Overlay. Press ESC on the window to close.")
        self.root.mainloop()

if __name__ == "__main__":
    overlay = RadarOverlay()
    overlay.run()
