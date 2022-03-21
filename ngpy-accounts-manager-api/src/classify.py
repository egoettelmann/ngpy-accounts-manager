import sys

sys.path.append('./site-packages')

from app.main import entity_manager
from app.domain.classifiers import Classifier
from app.modules.depynject import Depynject
from app.modules.di_providers import SimplePrototypeDiProvider

# Configuring Dependency Injection
spdi_provider = SimplePrototypeDiProvider()
depynject_container = Depynject(providers={
    'request': spdi_provider.provide
})
depynject_container.register_singleton(entity_manager)
classifier: Classifier = depynject_container.provide(Classifier)

##########################
# Executing the Classifier
##########################
if __name__ == '__main__':
    classifier.train()
    classifier.predict()
