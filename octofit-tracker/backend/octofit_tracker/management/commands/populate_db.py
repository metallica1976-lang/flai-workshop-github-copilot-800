from django.core.management.base import BaseCommand
from octofit_tracker.models import User, Team, Activity, Leaderboard, Workout
from datetime import date


class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Clearing existing data...')
        Leaderboard.objects.all().delete()
        Activity.objects.all().delete()
        Team.objects.all().delete()
        User.objects.all().delete()
        Workout.objects.all().delete()

        self.stdout.write('Creating users (superheroes)...')
        users_data = [
            {'email': 'tony.stark@avengers.com', 'name': 'Tony Stark', 'age': 45},
            {'email': 'steve.rogers@avengers.com', 'name': 'Steve Rogers', 'age': 105},
            {'email': 'natasha.romanoff@avengers.com', 'name': 'Natasha Romanoff', 'age': 38},
            {'email': 'thor.odinson@avengers.com', 'name': 'Thor Odinson', 'age': 1500},
            {'email': 'bruce.banner@avengers.com', 'name': 'Bruce Banner', 'age': 49},
            {'email': 'bruce.wayne@dc.com', 'name': 'Bruce Wayne', 'age': 40},
            {'email': 'clark.kent@dc.com', 'name': 'Clark Kent', 'age': 35},
            {'email': 'diana.prince@dc.com', 'name': 'Diana Prince', 'age': 3000},
            {'email': 'barry.allen@dc.com', 'name': 'Barry Allen', 'age': 28},
            {'email': 'hal.jordan@dc.com', 'name': 'Hal Jordan', 'age': 36},
        ]
        users = {}
        for data in users_data:
            user = User.objects.create(**data)
            users[data['name']] = user
            self.stdout.write(f'  Created user: {user.name}')

        self.stdout.write('Creating teams...')
        team_marvel = Team.objects.create(name='Team Marvel')
        team_marvel.members.set([
            users['Tony Stark'], users['Steve Rogers'],
            users['Natasha Romanoff'], users['Thor Odinson'], users['Bruce Banner']
        ])
        team_marvel.save()

        team_dc = Team.objects.create(name='Team DC')
        team_dc.members.set([
            users['Bruce Wayne'], users['Clark Kent'],
            users['Diana Prince'], users['Barry Allen'], users['Hal Jordan']
        ])
        team_dc.save()
        self.stdout.write(f'  Created team: {team_marvel.name}')
        self.stdout.write(f'  Created team: {team_dc.name}')

        self.stdout.write('Creating activities...')
        activities_data = [
            {'user': users['Tony Stark'], 'activity_type': 'Running', 'duration': 30.0, 'date': date(2024, 1, 10)},
            {'user': users['Steve Rogers'], 'activity_type': 'Strength Training', 'duration': 60.0, 'date': date(2024, 1, 11)},
            {'user': users['Natasha Romanoff'], 'activity_type': 'Martial Arts', 'duration': 45.0, 'date': date(2024, 1, 12)},
            {'user': users['Thor Odinson'], 'activity_type': 'Hammer Throw', 'duration': 20.0, 'date': date(2024, 1, 13)},
            {'user': users['Bruce Banner'], 'activity_type': 'Yoga', 'duration': 50.0, 'date': date(2024, 1, 14)},
            {'user': users['Bruce Wayne'], 'activity_type': 'Krav Maga', 'duration': 60.0, 'date': date(2024, 1, 10)},
            {'user': users['Clark Kent'], 'activity_type': 'Flying', 'duration': 15.0, 'date': date(2024, 1, 11)},
            {'user': users['Diana Prince'], 'activity_type': 'Sword Training', 'duration': 55.0, 'date': date(2024, 1, 12)},
            {'user': users['Barry Allen'], 'activity_type': 'Sprinting', 'duration': 5.0, 'date': date(2024, 1, 13)},
            {'user': users['Hal Jordan'], 'activity_type': 'Ring Constructs', 'duration': 40.0, 'date': date(2024, 1, 14)},
        ]
        for data in activities_data:
            activity = Activity.objects.create(**data)
            self.stdout.write(f'  Created activity: {activity}')

        self.stdout.write('Creating leaderboard...')
        leaderboard_data = [
            {'user': users['Steve Rogers'], 'score': 950},
            {'user': users['Diana Prince'], 'score': 920},
            {'user': users['Thor Odinson'], 'score': 900},
            {'user': users['Clark Kent'], 'score': 880},
            {'user': users['Bruce Wayne'], 'score': 860},
            {'user': users['Tony Stark'], 'score': 840},
            {'user': users['Natasha Romanoff'], 'score': 820},
            {'user': users['Hal Jordan'], 'score': 800},
            {'user': users['Bruce Banner'], 'score': 780},
            {'user': users['Barry Allen'], 'score': 760},
        ]
        for data in leaderboard_data:
            entry = Leaderboard.objects.create(**data)
            self.stdout.write(f'  Created leaderboard entry: {entry}')

        self.stdout.write('Creating workouts...')
        workouts_data = [
            {
                'name': 'Iron Man Circuit',
                'description': 'High-intensity circuit training inspired by Tony Stark',
                'exercises': ['Push-ups 3x20', 'Pull-ups 3x10', 'Plank 3x60s', 'Box jumps 3x15'],
            },
            {
                'name': 'Super Soldier Program',
                'description': 'Full-body strength training like Steve Rogers',
                'exercises': ['Deadlift 5x5', 'Bench press 5x5', 'Squat 5x5', 'Overhead press 5x5'],
            },
            {
                'name': 'Amazon Warrior Training',
                'description': 'Agility and strength routine like Diana Prince',
                'exercises': ['Sword drills 30min', 'Sprint intervals 10x100m', 'Shield work 20min', 'Combat rolls 3x15'],
            },
            {
                'name': 'Dark Knight Conditioning',
                'description': 'Endurance and combat training inspired by Bruce Wayne',
                'exercises': ['Krav Maga 45min', 'Rope climbing 5x', 'Weighted vest run 5km', 'Obstacle course'],
            },
            {
                'name': 'Speed Force Warm-up',
                'description': 'Quick warm-up routine for Barry Allen fans',
                'exercises': ['Dynamic stretching 10min', 'High knees 3x30s', 'Butt kicks 3x30s', 'Lateral shuffles 3x20'],
            },
            {
                'name': 'Asgardian Thunder Power',
                'description': 'Godly strength and endurance program inspired by Thor Odinson',
                'exercises': ['Hammer swings 5x10', 'Weighted carries 4x50m', 'Battle ropes 5x30s', 'Viking press 4x8', 'Farmer walks 3x40m'],
            },
            {
                'name': 'Black Widow Stealth Fitness',
                'description': 'Agility, flexibility and combat conditioning like Natasha Romanoff',
                'exercises': ['Gymnastics bridge 3x60s', 'Pistol squats 3x10', 'Handstand holds 3x30s', 'Martial arts combos 4x2min', 'Parkour drills 20min'],
            },
            {
                'name': 'Hulk Smash Strength',
                'description': 'Raw power and stress-relief training inspired by Bruce Banner',
                'exercises': ['Heavy deadlifts 5x3', 'Tire flips 4x8', 'Sledgehammer slams 4x15', 'Medicine ball throws 3x12', 'Breathing cooldown 10min'],
            },
            {
                'name': 'Man of Steel Endurance',
                'description': 'Superhuman cardio and strength program like Clark Kent',
                'exercises': ['Mile run 5x', 'Clean and jerk 4x6', 'Swimming sprints 10x50m', 'Pull-ups 4x15', 'Core stability circuit 20min'],
            },
            {
                'name': 'Green Lantern Will Power',
                'description': 'Mental focus and full-body conditioning like Hal Jordan',
                'exercises': ['Concentration curls 4x12', 'Meditation & breath work 15min', 'Plyometric circuit 4x5min', 'Balance board 3x90s', 'Long-distance run 8km'],
            },
        ]
        for data in workouts_data:
            workout = Workout.objects.create(**data)
            self.stdout.write(f'  Created workout: {workout.name}')

        self.stdout.write(self.style.SUCCESS('Database populated successfully!'))
