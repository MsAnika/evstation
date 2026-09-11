from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from workflow import HOSTS, get_matches, prepare_session, run_charging, run_dispatch, run_route, settle_session

app = FastAPI(title="GridMitra Local Mesh")
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])


class DispatchRequest(BaseModel):
    host_id: str | None = None


@app.get("/api/health")
async def health() -> dict:
    return {"status": "online", "mode": "local-deterministic"}


@app.get("/api/hosts")
async def hosts() -> list[dict]:
    return HOSTS


@app.get("/api/matches")
async def matches() -> list[dict]:
    return get_matches()


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
