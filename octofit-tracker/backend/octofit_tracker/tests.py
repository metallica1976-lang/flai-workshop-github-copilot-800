from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import User, Team, Activity, Leaderboard, Workout
from datetime import date


class UserAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create(
            email='test.hero@marvel.com', name='Test Hero', age=30
        )

    def test_list_users(self):
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_user(self):
        data = {'email': 'new.hero@dc.com', 'name': 'New Hero', 'age': 25}
        response = self.client.post('/api/users/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_user(self):
        response = self.client.get(f'/api/users/{self.user.pk}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Test Hero')


class TeamAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create(
            email='tony.stark@avengers.com', name='Tony Stark', age=45
        )
        self.team = Team.objects.create(name='Team Marvel')
        self.team.members.set([self.user])

    def test_list_teams(self):
        response = self.client.get('/api/teams/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_team(self):
        data = {'name': 'Team DC'}
        response = self.client.post('/api/teams/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_team(self):
        response = self.client.get(f'/api/teams/{self.team.pk}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Team Marvel')


class ActivityAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create(
            email='steve.rogers@avengers.com', name='Steve Rogers', age=105
        )
        self.activity = Activity.objects.create(
            user=self.user,
            activity_type='Running',
            duration=30.0,
            date=date(2024, 1, 10),
        )

    def test_list_activities(self):
        response = self.client.get('/api/activities/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_activity(self):
        response = self.client.get(f'/api/activities/{self.activity.pk}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['activity_type'], 'Running')


class LeaderboardAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create(
            email='thor.odinson@avengers.com', name='Thor Odinson', age=1500
        )
        self.entry = Leaderboard.objects.create(user=self.user, score=900)

    def test_list_leaderboard(self):
        response = self.client.get('/api/leaderboard/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_leaderboard_ordered_by_score(self):
        user2 = User.objects.create(
            email='diana.prince@dc.com', name='Diana Prince', age=3000
        )
        Leaderboard.objects.create(user=user2, score=950)
        response = self.client.get('/api/leaderboard/')
        scores = [entry['score'] for entry in response.data]
        self.assertEqual(scores, sorted(scores, reverse=True))


class WorkoutAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.workout = Workout.objects.create(
            name='Iron Man Circuit',
            description='High-intensity circuit training',
            exercises=['Push-ups 3x20', 'Pull-ups 3x10'],
        )

    def test_list_workouts(self):
        response = self.client.get('/api/workouts/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_workout(self):
        response = self.client.get(f'/api/workouts/{self.workout.pk}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Iron Man Circuit')


class APIRootTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_root_redirects_to_api(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_api_root(self):
        response = self.client.get('/api/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('endpoints', response.data)
