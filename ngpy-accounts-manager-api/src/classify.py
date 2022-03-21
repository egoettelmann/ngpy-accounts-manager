import sys

sys.path.append('./site-packages')

from app.modules.depynject import Depynject
from app.modules.di_providers import StaticSingletonDiProvider

from app.domain.services import ClassificationService

from app.main import entity_manager

# Configuring Dependency Injection
spdi_provider = StaticSingletonDiProvider()
depynject_container = Depynject(providers={
    'request': spdi_provider.provide
})
depynject_container.register_singleton(entity_manager)
classification_service: ClassificationService = depynject_container.provide(ClassificationService)

##########################
# Executing the Classifier
##########################
if __name__ == '__main__':
    classification_service.perform_training()
    classification_service.predict_sample()
