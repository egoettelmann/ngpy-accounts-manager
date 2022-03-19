import sys

sys.path.append('./site-packages')

import logging

from app.main import entity_manager
from app.domain.search_request import PageRequest, SortRequest, SearchRequest
from app.domain.services import TransactionService
from app.modules.depynject import Depynject
from app.modules.di_providers import SimplePrototypeDiProvider

# Configuring Dependency Injection
spdi_provider = SimplePrototypeDiProvider()
depynject_container = Depynject(providers={
    'request': spdi_provider.provide
})
depynject_container.register_singleton(entity_manager)
transaction_service: TransactionService = depynject_container.provide(TransactionService)

##########################
# Executing the Classifier
##########################
if __name__ == '__main__':
    import numpy
    from sklearn.model_selection import train_test_split
    from sklearn.feature_extraction.text import CountVectorizer
    from sklearn.linear_model import LogisticRegression

    # Loading transactions
    search_request = SearchRequest(
        None,
        SortRequest(
            'date_value',
            True
        ),
        PageRequest(
            0,
            10000
        )
    )
    transactions = transaction_service.search_all(search_request)

    # Creating training sets
    sentences = numpy.array([t.description for t in transactions])
    labels = numpy.array([t.label_id for t in transactions])

    sentences_train, sentences_test, y_train, y_test = train_test_split(
        sentences, labels, test_size=0.25, random_state=1000)

    vectorizer = CountVectorizer()
    vectorizer.fit(sentences_train)
    X_train = vectorizer.transform(sentences_train)
    X_test = vectorizer.transform(sentences_test)

    # Training model
    classifier = LogisticRegression()
    classifier.fit(X_train, y_train)
    score = classifier.score(X_test, y_test)
    print("Accuracy: ", score)
