from django.db import models

# Create your models here.
from django.db import models


# Create your models here.
class UserData(models.Model):
    verbose_name_plural = "Order Details"
    soulgoodno = models.CharField(max_length=255, null=True)
    fnamelname = models.CharField(max_length=255, null=True)
    phone = models.CharField(max_length=255, null=True)
    email = models.CharField(max_length=255, null=True)
    zipcode = models.CharField(max_length=255, null=True)
    deliveryoption = models.CharField(max_length=255, null=True)
    feelings = models.CharField(max_length=255, null=True)

    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return str(self.fnamelname)