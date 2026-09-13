from datetime import datetime, timezone


hardware_state = {
    "status": "idle",
    "host_id": None,
    "otp": None,
    "delivered": 0.0,
    "voltage": 0.0,
    "current": 0.0,
    "power": 0.0,
    "cost": 0.0,
    "elapsed_seconds": 0,
    "started_at": None,
    "updated_at": None,
}


def state() -> dict:
    return hardware_state.copy()


def arm(host_id: str, otp: str) -> dict:
    hardware_state.update(
        {
            "status": "waiting_for_button",
            "host_id": host_id,
            "otp": otp,
            "delivered": 0.0,
            "voltage": 0.0,
            "current": 0.0,
            "power": 0.0,
            "cost": 0.0,
            "elapsed_seconds": 0,
            "started_at": None,
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }
    )
    return state()


def press_button() -> dict:
    if hardware_state["status"] != "waiting_for_button":
        return state()
    hardware_state.update(
        {
            "status": "charging",
            "started_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }
    )
    return state()


def stop_charging() -> dict:
    if hardware_state["status"] not in {"charging", "complete"}:
        return state()
    hardware_state.update(
        {
            "status": "stopped",
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }
    )
    return state()


def record_reading(
    delivered: float,
    voltage: float,
    current: float,
    power: float,
    elapsed_seconds: int,
    cost: float | None = None,
    complete: bool = False,
) -> dict:
    if hardware_state["status"] not in {"charging", "complete"}:
        return state()
    hardware_state.update(
        {
            "status": "complete" if complete else "charging",
            "delivered": delivered,
            "voltage": voltage,
            "current": current,
            "power": power,
            "cost": hardware_state["cost"] if cost is None else cost,
            "elapsed_seconds": elapsed_seconds,
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }
    )
    return state()