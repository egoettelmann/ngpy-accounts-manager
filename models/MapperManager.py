from mapper.object_mapper import ObjectMapper

from models.Mapper import Mapper
from models.domain.Label import Label
from models.entities.LabelDbo import LabelDbo


class MapperManager():
    _mapper = None

    @staticmethod
    def init():
        MapperManager._mapper = Mapper()
        MapperManager._mapper.create_map(LabelDbo, Label)

    @staticmethod
    def getInstance():
        if MapperManager._mapper is None:
            MapperManager.init()
        return MapperManager._mapper
