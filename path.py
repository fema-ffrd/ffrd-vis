from fastapi import Query

def DatasetPathParams(
        path: str = Query(
            ...,
            description="A path to a raster file"
        )
) -> str:
    # retrieve tiles from Azure Storage
    # TODO: replace this with S3?
    return f"/vsiaz/data/{path}"
