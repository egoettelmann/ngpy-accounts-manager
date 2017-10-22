from mapper.object_mapper import ObjectMapper


class Mapper(ObjectMapper):

    def map_all(self, object_list, target_type):
        target_list = []
        for obj in object_list:
            target_list.append(self.map(obj, target_type))
        return target_list
