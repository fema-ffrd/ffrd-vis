# Introduction 
A visualization website deployed as a Python Azure App Service. This mapping website is a static HTML file hosted in a FastAPI application. Also hosted in the FastAPI application is a configured instance of TiTiler to render raster files in Azure Blob Storage as map tiles. The mapping website allows the user to switch the TiTiler display between different bands in the raster (representing different recurrence intervals) and also to query the raster cell value at a lat/lon coordinate clicked on the map. Test map pages are located at http(s)://{host}/map/index.html.

# Running Locally using Visual Studio Code
1.	Clone the repository to a local directory.
2.	Install Python 3.12 on your system.
3.	Use Python 3.12 to create a virtual environment in the local directory using the `venv` command (preferably called `.venv`).
4.  Open the project in VS Code and set the Python interpreter to `.\.venv\Scripts\python.exe`.
5.  Set an environment variable *AZURE_STORAGE_CONNECTION_STRING* to the connection string to an Azure Storage account where the raster files are stored.
6.  Set an environment variable *API_URL* to the REST endpoint for the query API. See the API project for deployment and call instructions.
7.  Use the Debug panel to start the application locally from the *run.py* file and debug its code.

# Running in a Hosted Web Application
1.	Clone the repository to a local directory.
2.	Install Python 3.12 on your system.
3.	Use Python 3.12 to create a virtual environment in the local directory using the `venv` command (preferably called `.venv`).
4.  Set an environment variable *AZURE_STORAGE_CONNECTION_STRING* to the connection string to an Azure Storage account where the raster files are stored.
5.  Set an environment variable *API_URL* to the REST endpoint for the query API. See the API project for deployment and call instructions.
6.  Set the web host to serve the website using "python -m hypercorn -b 0.0.0.0 -w 5 asgi:run:app".

# Switching between bands
Use the widget at the top right of the map to switch the tiled layer between bands/recurrence intervals/layer types (depth/velocity).

# Querying raster values
Use the widget at the bottom left of the map to query the value of a specific raster cell across all raster bands/recurrence intervals. Click the *Raster Cell Query* button and it will turn green (indicating the query is active) and the mouse pointer will turn into a crosshair cursor. Click on a location on the map. A marker will appear at the clicked point on the map, and the widget table will display the raster cell value located at that point across all bands (with "No Data" displayed if that cell was a NODATA value in that band). If you are querying depth values, the plot widget will also appear in the bottom right of the map displaying a linear plot of depth across all recurrence intervals. Click the *Raster Cell Query* button again and the button will go back to gray (indicating the query is disabled), the table will clear, the marker will be removed, and the crosshair cursor will go back to the default cursor.