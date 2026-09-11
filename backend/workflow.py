import asyncio
import json
from pathlib import Path
from typing import AsyncIterator

POLICIES = json.loads((Path(__file__).parent / "policies.json").read_text())

HOSTS = [
    {"id": "HM-01", "name": "Aarav Residence", "area": "Saket", "lat": 28.5245, "lng": 77.2066, "distance": 1.8, "capacity": 11, "available": True, "state": "Delhi"},
    {"id": "HM-02", "name": "Nehru Place Home", "area": "Nehru Place", "lat": 28.5494, "lng": 77.2501, "distance": 3.4, "capacity": 7, "available": True, "state": "Delhi"},
    {"id": "HM-03", "name": "Rohini Solar House", "area": "Rohini", "lat": 28.7041, "lng": 77.1025, "distance": 7.2, "capacity": 9, "available": False, "state": "Delhi"},
    {"id": "HM-04", "name": "Gurugram Edge Node", "area": "DLF Phase 2", "lat": 28.4941, "lng": 77.0878, "distance": 5.6, "capacity": 22, "available": True, "state": "Delhi"},
    {"id": "HM-05", "name": "Noida Sector 18 Home", "area": "Noida", "lat": 28.5706, "lng": 77.3219, "distance": 9.8, "capacity": 15, "available": True, "state": "Delhi"},
    {"id": "HM-06", "name": "Dwarka Community Node", "area": "Dwarka", "lat": 28.5921, "lng": 77.046, "distance": 11.4, "capacity": 12, "available": True, "state": "Delhi"},
    {"id": "HM-07", "name": "Ghaziabad Solar Home", "area": "Indirapuram", "lat": 28.6415, "lng": 77.3715, "distance": 14.2, "capacity": 10, "available": True, "state": "Delhi"},
    {"id": "HM-08", "name": "Faridabad Green Node", "area": "Faridabad", "lat": 28.4089, "lng": 77.3178, "distance": 16.7, "capacity": 18, "available": True, "state": "Delhi"},
    {"id": "HM-09", "name": "Manesar Fleet House", "area": "Manesar", "lat": 28.3515, "lng": 76.9366, "distance": 23.4, "capacity": 25, "available": False, "state": "Delhi"}
]


def event(agent: str, title: str, message: str, status: str = "complete", data: dict | None = None) -> dict:
    return {"agent": agent, "title": title, "message": message, "status": status, "data": data or {}}


def sse(payload: dict) -> str:
    return f"data: {json.dumps(payload)}\n\n"


def get_matches() -> list[dict]:
    available = [host for host in HOSTS if host["available"]]
    return sorted(available, key=lambda host: (host["distance"], -host["capacity"]))[:2]


def prepare_session(selected_host_id: str) -> dict:
    selected = next((host for host in HOSTS if host["id"] == selected_host_id), None)
    if selected is None or not selected["available"]:
        raise ValueError("Selected host is unavailable")

    policy = POLICIES[selected["state"]]
    session_units = 8.4
    consumed_units = 164
    headroom = max(policy["free_units"] - consumed_units, 0)
    subsidized_units = min(session_units, headroom)
    paid_units = session_units - subsidized_units
    tariff = (subsidized_units * (policy["base_rate"] - policy["subsidy_rate"]) + paid_units * policy["base_rate"]) / session_units
    driver_total = round(subsidized_units * (policy["base_rate"] - policy["subsidy_rate"]) + paid_units * policy["base_rate"], 2)
    return {"host": selected, "policy": policy, "headroom": headroom, "session_units": session_units, "subsidized_units": subsidized_units, "tariff": tariff, "driver_total": driver_total, "savings": round(subsidized_units * policy["subsidy_rate"], 2)}


async def run_route(selected_host_id: str) -> AsyncIterator[str]:
    prepared = prepare_session(selected_host_id)
    host = prepared["host"]
    yield sse(event("ROUTE", "Journey started", f"Navigation active to {host['name']} in {host['area']}.", status="journey", data={"host": host}))
    await asyncio.sleep(1.2)
    yield sse(event("ROUTE", "Destination reached", f"Driver reached {host['name']}. Charging bay is ready.", status="reached", data={"host": host}))


async def run_charging(selected_host_id: str) -> AsyncIterator[str]:
    prepared = prepare_session(selected_host_id)
    yield sse(event("GRID / IOT", "Charging started", "Smart meter handshake complete. Energy delivery has started.", status="charging", data={"delivered": 0, "voltage": 229}))
    delivered = 0.0
    for tick in range(1, 7):
        delivered = round(min(prepared["session_units"], delivered + 1.4), 1)
        voltage = 228 + (tick % 3)
        yield sse(event("GRID / IOT", "Energy packet received", f"Meter tick {tick}: {delivered:.1f} kWh delivered at {voltage} V.", status="charging", data={"delivered": delivered, "voltage": voltage, "tick": tick}))
        await asyncio.sleep(0.55)
    yield sse(event("GRID / IOT", "Charging complete", f"{delivered:.1f} kWh delivered. Vehicle is ready to depart.", status="charging_done", data={"delivered": delivered, "voltage": 229}))


def settle_session(selected_host_id: str, delivered: float = 8.4) -> dict:
    prepared = prepare_session(selected_host_id)
    commission = round(prepared["driver_total"] * 0.08, 2)
    host_payout = round(prepared["driver_total"] - commission, 2)
    return {"delivered": delivered, "driver_total": prepared["driver_total"], "host_payout": host_payout, "commission": commission, "savings": prepared["savings"]}


async def run_dispatch(selected_host_id: str | None = None) -> AsyncIterator[str]:
    available = [host for host in HOSTS if host["available"]]
    selected = next((host for host in available if host["id"] == selected_host_id), None)
    if selected is None:
        selected = min(available, key=lambda host: (host["distance"], -host["capacity"]))

    yield sse(event("MATCHMAKER", "Host selected", f"{selected['name']} is the best available node at {selected['distance']} km.", data={"host": selected}))
    await asyncio.sleep(0.75)

    policy = POLICIES[selected["state"]]
    session_units = 8.4
    consumed_units = 164
    headroom = max(policy["free_units"] - consumed_units, 0)
    subsidized_units = min(session_units, headroom)
    yield sse(event("SUBSIDY", "Policy verified", f"{subsidized_units:.1f} kWh receives the {selected['state']} household subsidy.", data={"headroom": headroom, "subsidized_units": subsidized_units, "policy": policy}))
    await asyncio.sleep(0.75)

    paid_units = session_units - subsidized_units
    tariff = (subsidized_units * (policy["base_rate"] - policy["subsidy_rate"]) + paid_units * policy["base_rate"]) / session_units
    yield sse(event("PRICING", "Tariff locked", f"Effective tariff is Rs {tariff:.2f}/kWh after subsidy adjustment.", data={"tariff": tariff, "session_units": session_units}))
    await asyncio.sleep(0.75)

    delivered = 0.0
    for tick in range(1, 7):
        delivered = round(min(session_units, delivered + 1.4), 1)
        voltage = 228 + (tick % 3)
        yield sse(event("GRID / IOT", "Energy packet received", f"Meter tick {tick}: {delivered:.1f} kWh delivered at {voltage} V.", status="streaming", data={"delivered": delivered, "voltage": voltage, "tick": tick}))
        await asyncio.sleep(0.55)

    driver_total = round(subsidized_units * (policy["base_rate"] - policy["subsidy_rate"]) + paid_units * policy["base_rate"], 2)
    commission = round(driver_total * 0.08, 2)
    host_payout = round(driver_total - commission, 2)
    yield sse(event("SETTLEMENT", "Settlement ready", f"Rs {driver_total:.2f} driver bill split into host payout and platform fee.", data={"delivered": delivered, "driver_total": driver_total, "host_payout": host_payout, "commission": commission, "savings": round(subsidized_units * policy["subsidy_rate"], 2)}))
    await asyncio.sleep(0.4)
    yield sse({"type": "complete", "message": "GridMitra session settled."})
