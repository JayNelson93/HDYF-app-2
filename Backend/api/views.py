from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions
from django.contrib.auth.models import User
import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn import tree

from api.models import UserData
from api.serializers import UserDataSerializer


class ListUsers(APIView):

    authentication_classes = [authentication.TokenAuthentication]

    # permission_classes = [permissions.IsAdminUser]

    def post(self, request, format=None):
        """
        Return a list of all users.
        """
        feelings2_data = pd.read_csv('feelings2.csv')
        X = feelings2_data.drop(columns=['food'])
        y = feelings2_data['food']

        model = DecisionTreeClassifier()
        model.fit(X, y)
        predictions = dict()

        request.data.update({
            "feelings":
            ','.join(request.data['feelings'] if 'feelings' in
                     request.data else '')
        })

        data = request.data
        predic = []
        for feeling in data['feeling']:
            prediction = model.predict([[int(feeling)]])
            if prediction not in predic:
                predic.append(prediction)
                predictions[feeling] = prediction

        file_serial = UserDataSerializer(data=data,
                                         context={"request": request})

        if file_serial.is_valid():
            file_serial.save()

        res = {'menu_items': predictions}
        return Response(res)