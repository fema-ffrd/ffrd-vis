import os
import uvicorn
from fastapi import FastAPI, Request, Response
from fastapi.staticfiles import StaticFiles
from titiler.core.factory import TilerFactory
from titiler.core.errors import DEFAULT_STATUS_CODES, add_exception_handlers
from path import DatasetPathParams
from colormaps import ColorMapParams

# For testing only, set connection string in app settings so it can be updated when storage keys are rotated
# also set up the API URL for raster queries
# TODO: set app settings for access to S3?
# os.environ["AZURE_STORAGE_CONNECTION_STRING"] = f""
# os.environ["API_URL"] = f"https://{host_root}/api/"

# set up the app instance
app = FastAPI(openapi_url="/api", docs_url="/api.html")
@app.route("/", methods=['GET'])
def index(request: Request):
    return Response("App is running", status_code=200)
@app.route("/apiurl", methods=['GET'])
def getapiurl(request: Request):
    return Response(os.environ["API_URL"], status_code=200)

# set up the tiler
cog = TilerFactory(router_prefix="cog", path_dependency=DatasetPathParams, colormap_dependency=ColorMapParams)
app.include_router(cog.router, prefix="/cog", tags=["Cloud Optimized GeoTIFF"])
add_exception_handlers(app, DEFAULT_STATUS_CODES)

# set up the web map
app.mount("/map", StaticFiles(directory="map", html=True), name="map")

if __name__ == "__main__":
    uvicorn.run(app=app, host="127.0.0.1", port=8000, log_level="debug")