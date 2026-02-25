from django.db import models


class User(models.Model):
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=200)
    age = models.IntegerField()

    class Meta:
        db_table = 'users'

    def __str__(self):
        return self.name


class Team(models.Model):
    name = models.CharField(max_length=200)
    members = models.ManyToManyField(User, related_name='teams', blank=True)

    class Meta:
        db_table = 'teams'

    def __str__(self):
        return self.name


class Activity(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activities')
    activity_type = models.CharField(max_length=200)
    duration = models.FloatField(help_text='Duration in minutes')
    date = models.DateField()

    class Meta:
        db_table = 'activities'

    def __str__(self):
        return f"{self.user.name} - {self.activity_type}"


class Leaderboard(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='leaderboard_entries')
    score = models.IntegerField(default=0)

    class Meta:
        db_table = 'leaderboard'

    def __str__(self):
        return f"{self.user.name}: {self.score}"


class Workout(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    exercises = models.JSONField(default=list)

    class Meta:
        db_table = 'workouts'

    def __str__(self):
        return self.name
