#!/bin/python

import asyncio
import websockets
import time
import struct
import time


# Pack the HEARTBEAT_VALUE into a bytes object
heartbeat_data = struct.pack("!B", 1)

async def connect_to_websocket():
    uri = "ws://localhost:3000/?at=verysecuretokenhehehehehehehehe"
    try:
        while True:
            try:
                async with websockets.connect(uri) as websocket:
                    print("Connected to WebSocket server.")
                    while True:
                        message = await websocket.recv()
                        try:
                            message = message.decode()
                        except:
                            pass
                        if message == "1":
                            print("Received heartbeat from server.")
                            await websocket.send(heartbeat_data)  # Respond with a heartbeat
                        else:
                            print(f"Received message: {message}")
            except websockets.exceptions.ConnectionClosedError:
                print("Connection closed. Retrying in 5 seconds...")
                await asyncio.sleep(5)
    except:
        print("Connection closed. Retrying in 5 seconds...")
        time.sleep(5)

while True:
    asyncio.run(connect_to_websocket())
