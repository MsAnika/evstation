# Wokwi hardware bridge

The app does not start charging when the house OTP is generated. It first arms a hardware session:

```text
POST /api/hardware/arm
{"host_id":"greenvolt","otp":"1234"}
```

After the OTP is entered on the hardware, the Wokwi button should call:

```text
POST /api/hardware/button
```

The app polls `/api/hardware/state` and changes to the charging screen only after this request changes the state to `charging`.

While charging, send the meter values produced by the simulation:

```text
POST /api/hardware/reading
{
  "delivered": 1.25,
  "voltage": 229.0,
  "current": 5.46,
  "power": 1.25,
  "cost": 16.25,
  "elapsed_seconds": 12,
  "complete": false
}
```

Set `complete` to `true` for the final reading. The frontend continuously polls and displays `delivered`, `voltage`, `current`, `power`, and `cost` from the same state returned by the hardware bridge. The `cost` field is optional for older sketches, but add it to show live cost from Wokwi.

Before moving to payment, the app calls:

```text
POST /api/hardware/stop
```

The Wokwi sketch should poll `/api/hardware/state` and switch off its relay, load, and charging indicator whenever the state is `stopped`. This stops the simulated charging hardware automatically. FastAPI cannot close the Wokwi browser simulation itself.

Wokwi cannot normally reach `localhost` on the developer computer. Use a reachable LAN address or an HTTPS tunnel for the FastAPI server, and put that base URL in the Wokwi sketch. The FastAPI server must be started with:

```text
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```