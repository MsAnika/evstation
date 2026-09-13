from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from hardware import arm, press_button, record_reading, state, stop_charging
from workflow import HOSTS, get_matches, prepare_session, run_charging, run_dispatch, run_route, settle_session

app = FastAPI(title="GridMitra Local Mesh")
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])


class DispatchRequest(BaseModel):
    host_id: str | None = None


class HardwareArmRequest(BaseModel):
    host_id: str
    otp: str


class HardwareReadingRequest(BaseModel):
    delivered: float
    voltage: float
    current: float
    power: float
    cost: float | None = None
    elapsed_seconds: int
    complete: bool = False


class TripRecord(BaseModel):
    host: str
    owner: str
    kwh: float
    total: float
    started_at: str
    finished_at: str
    duration_seconds: int


trip_history: list[dict] = []


@app.get("/api/health")
async def health() -> dict:
    return {"status": "online", "mode": "local-deterministic"}


@app.get("/api/hardware/state")
async def hardware() -> dict:
    return state()


@app.post("/api/hardware/arm")
async def arm_hardware(request: HardwareArmRequest) -> dict:
    return arm(request.host_id, request.otp)


@app.post("/api/hardware/button")
async def hardware_button() -> dict:
    return press_button()


@app.post("/api/hardware/stop")
async def hardware_stop() -> dict:
    return stop_charging()


@app.post("/api/hardware/reading")
async def hardware_reading(request: HardwareReadingRequest) -> dict:
    return record_reading(**request.model_dump())


@app.get("/api/hosts")
async def hosts() -> list[dict]:
    return HOSTS


@app.get("/api/matches")
async def matches() -> list[dict]:
    return get_matches()


@app.get("/api/trips")
async def trips() -> list[dict]:
    return trip_history


@app.post("/api/trips")
async def create_trip(record: TripRecord) -> dict:
    trip = {"id": f"VP-{len(trip_history) + 1:04d}", **record.model_dump()}
    trip_history.insert(0, trip)
    return trip


@app.post("/api/prepare")
async def prepare(request: DispatchRequest) -> dict:
    if not request.host_id:
        return {"error": "host_id is required"}
    try:
        return prepare_session(request.host_id)
    except ValueError as error:
        return {"error": str(error)}


@app.post("/api/route")
async def route(request: DispatchRequest) -> StreamingResponse:
    if not request.host_id:
        return StreamingResponse(iter(["data: {\"error\": \"host_id is required\"}\n\n"]), media_type="text/event-stream")
    return StreamingResponse(run_route(request.host_id), media_type="text/event-stream", headers={"Cache-Control": "no-cache", "Connection": "keep-alive"})


@app.post("/api/charging")
async def charging(request: DispatchRequest) -> StreamingResponse:
    if not request.host_id:
        return StreamingResponse(iter(["data: {\"error\": \"host_id is required\"}\n\n"]), media_type="text/event-stream")
    return StreamingResponse(run_charging(request.host_id), media_type="text/event-stream", headers={"Cache-Control": "no-cache", "Connection": "keep-alive"})


@app.post("/api/settle")
async def settle(request: DispatchRequest) -> dict:
    if not request.host_id:
        return {"error": "host_id is required"}
    return settle_session(request.host_id)


@app.post("/api/dispatch")
async def dispatch(request: DispatchRequest) -> StreamingResponse:
    return StreamingResponse(run_dispatch(request.host_id), media_type="text/event-stream", headers={"Cache-Control": "no-cache", "Connection": "keep-alive"})
