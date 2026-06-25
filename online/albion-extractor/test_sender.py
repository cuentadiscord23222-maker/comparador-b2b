import socket
import json
import time
import math

UDP_IP = "127.0.0.1"
UDP_PORT = 5555

def send_test_data():
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    print(f"Sending test data to UDP {UDP_IP}:{UDP_PORT}...")
    
    angle = 0
    while True:
        # Simulate moving entities
        # Enemy moving in a circle
        enemy_x = 40 * math.cos(math.radians(angle))
        enemy_y = 40 * math.sin(math.radians(angle))
        
        # Resource oscillating
        res_x = -30
        res_y = 20 * math.sin(math.radians(angle * 2))
        
        payload = {
            "entities": [
                {"id": 101, "type": "enemy", "x": enemy_x, "y": enemy_y},
                {"id": 102, "type": "resource", "x": res_x, "y": res_y},
                {"id": 103, "type": "ally", "x": 10.0, "y": -15.0}
            ]
        }
        
        message = json.dumps(payload).encode('utf-8')
        sock.sendto(message, (UDP_IP, UDP_PORT))
        
        angle = (angle + 5) % 360
        time.sleep(0.1)

if __name__ == "__main__":
    try:
        send_test_data()
    except KeyboardInterrupt:
        print("\nTest sender stopped.")
