import json

from typing import Dict, Optional, Literal, Sequence
from typing_extensions import Annotated

from rio_tiler.colormap import parse_color
from rio_tiler.colormap import cmap as default_cmap, ColorMaps
from fastapi import HTTPException, Query

def AddColorMaps() -> ColorMaps:
    map = default_cmap

    # blues
    map = map.register(
         {
              "nfip_depth": [((0, 0.99999), (114, 177, 215, 255)), ((1, 1.99999), (103, 164, 204, 255)), ((2, 2.99999), (92, 151, 193, 255)), ((3, 3.99999), (82, 138, 182, 255)), ((4, 4.99999), (71, 125, 171, 255)), ((5, 5.99999), (61, 112, 161, 255)), ((6, 6.99999), (50, 99, 150, 255)), ((7, 7.99999), (39, 86, 139, 255)), ((8, 8.99999), (29, 73, 128, 255)), ((9, 9.99999), (18, 60, 117, 255)), ((10, 999), (8, 48, 107, 255))]
         }
    )

    # purples
    map = map.register(
         {
              "nfip_vel": [((0, 0.99999), (165, 162, 204, 255)), ((1, 1.99999), (154, 145, 196, 255)), ((2, 2.99999), (144, 129, 188, 255)), ((3, 3.99999), (134, 113, 180, 255)), ((4, 4.99999), (124, 97, 172, 255)), ((5, 5.99999), (114, 81, 164, 255)), ((6, 6.99999), (103, 64, 156, 255)), ((7, 7.99999), (93, 48, 148, 255)), ((8, 8.99999), (83, 32, 140, 255)), ((9, 9.99999), (73, 16, 132, 255)), ((10, 999), (63, 0, 125, 255))]
         }
    )

    return map

customColors = AddColorMaps()
colorNames = customColors.list()
colorNames.sort()

def ColorMapParams(
        colormap_name: Annotated[
            Literal[tuple(colorNames)],
            Query(..., description="Colormap name"),
        ] = None,
        colormap: Annotated[
            Optional[str], Query(..., description="JSON encoded custom Colormap")
        ] = None,
    ) -> Optional[Dict]:
        if colormap_name:
            return customColors.get(colormap_name)

        if colormap:
            try:
                c = json.loads(
                    colormap,
                    object_hook=lambda x: {
                        int(k): parse_color(v) for k, v in x.items()
                    },
                )

                # Make sure to match colormap type
                if isinstance(c, Sequence):
                    c = [(tuple(inter), parse_color(v)) for (inter, v) in c]

                return c
            except json.JSONDecodeError as e:
                raise HTTPException(
                    status_code=400, detail="Could not parse the colormap value."
                ) from e

        return None