from ..domain.models import Label
from ..modules import restipy
from ..modules.depynject import injectable


@injectable()
@restipy.prefix('/labels')
class LabelController():

    def __init__(self, label_service):
        self.label_service = label_service

    @restipy.route('')
    @restipy.format_as(Label)
    def get_all(self):
        return self.label_service.get_all()

    @restipy.route('/<int:label_id>')
    @restipy.format_as(Label)
    def get_one(self, label_id):
        return self.label_service.get_by_id(label_id)

    @restipy.route('/<int:label_id>', methods=['DELETE'])
    def delete_one(self, label_id):
        return self.label_service.delete_label(label_id)

    @restipy.route('', methods=['POST'])
    @restipy.format_as(Label)
    @restipy.parse_as(Label)
    def save_one(self, label):
        return self.label_service.save_label(label)
