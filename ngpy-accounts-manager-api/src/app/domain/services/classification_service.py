import logging
import os
from typing import List, Optional

import joblib
import numpy
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline

from ..models import Transaction, Label
from ..search_request import PageRequest, SearchRequest, SortRequest
from ..services.label_service import LabelService
from ..services.transaction_service import TransactionService
from ...modules.depynject import injectable


@injectable()
class ClassificationService:
    """
    The classification service class that defines all business operations.
    """

    def __init__(self,
                 transaction_service: TransactionService,
                 label_service: LabelService
                 ) -> None:
        """Constructor

        :param transaction_service: the transaction service
        :param label_service: the label service
        """
        self.__transaction_service = transaction_service
        self.__label_service = label_service
        self.__threshold = 0.7
        self.__pipeline_filename = 'storage/current_pipeline.sav'
        self.__current_pipeline = None
        if os.path.exists(self.__pipeline_filename):
            self.__current_pipeline = joblib.load(self.__pipeline_filename)

    def predict(self, sentence: str) -> Optional[int]:
        # Performing prediction
        probabilities = self.__current_pipeline.predict_proba([sentence])
        prediction_indexes = numpy.argmax(probabilities, axis=1)
        classes = self.__current_pipeline.classes_
        predictions = [classes[i] for i in prediction_indexes]

        # Checking that threshold is reached
        prediction_idx = prediction_indexes[0]
        proba = probabilities[0][prediction_idx]
        label_id = predictions[0].item()
        if proba < self.__threshold:
            logging.debug('Prediction failed for "%s": "%s" (%s)', sentence, label_id, proba)
            return None

        logging.debug('Prediction success for "%s": "%s" (%s)', sentence, label_id, proba)
        return label_id

    def perform_training(self) -> None:
        # Loading training data
        transactions = self._get_training_data()

        # Creating training sets
        sentences = numpy.array([t.description for t in transactions])
        labels = numpy.array([t.label_id for t in transactions])
        X_train, X_test, y_train, y_test = train_test_split(
            sentences, labels, test_size=0.20, random_state=1000)

        # Retrieving score of current pipeline (if it exists)
        # TODO: we should persist the score in DB (to keep result with old data)
        current_score = 0
        if self.__current_pipeline is not None:
            current_score = self.__current_pipeline.score(X_test, y_test)
            logging.info('Retrieved score of current pipeline: %s', current_score)

        # Creating new pipeline
        logging.info('Starting training of new model')
        new_pipeline = Pipeline([
            ('vect', CountVectorizer()),
            ('clf', LogisticRegression(max_iter=200)),
        ])
        new_pipeline.fit(X_train, y_train)

        # Calculating new score
        new_score = new_pipeline.score(X_test, y_test)
        logging.info('Accuracy for new model: %s', new_score)

        # Checking if model should be updated
        if new_score > current_score:
            self.__current_pipeline = new_pipeline
            # TODO: persist to DB or s3 instead
            joblib.dump(new_pipeline, self.__pipeline_filename)
            logging.info('Stored new version of model to: %s', self.__pipeline_filename)

    def predict_sample(self) -> None:
        # Loading prediction data
        transactions = self._get_training_data(1000)

        # Creating prediction sets
        sentences = numpy.array([t.description for t in transactions])
        labels = numpy.array([t.label_id for t in transactions])
        X_train, X_test, Y_train, Y_test = train_test_split(
            sentences, labels, test_size=0.01)

        probabilities = self.__current_pipeline.predict_proba(X_test)
        prediction_indexes = numpy.argmax(probabilities, axis=1)
        classes = self.__current_pipeline.classes_
        predictions = [classes[i] for i in prediction_indexes]

        for idx, prediction_idx in enumerate(prediction_indexes):
            sentence = X_test[idx].item()
            label_id = predictions[idx]
            label = self.__label_service.get_by_id(label_id.item())
            proba = probabilities[idx][prediction_idx]
            logging.info('Prediction for "%s": "%s" (%s)', sentence, label.name, proba)

    def _get_training_data(self, size: int = 10000) -> List[Transaction]:
        search_request = SearchRequest(
            None,
            SortRequest(
                'date_value',
                True
            ),
            PageRequest(
                0,
                size
            )
        )
        return self.__transaction_service.search_all(search_request)
