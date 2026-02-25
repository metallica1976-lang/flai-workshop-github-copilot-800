from rest_framework import serializers
from .models import User, Team, Activity, Leaderboard, Workout


class UserSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    username = serializers.SerializerMethodField()
    team_id = serializers.SerializerMethodField()
    team_name = serializers.SerializerMethodField()
    team_id_write = serializers.PrimaryKeyRelatedField(
        queryset=Team.objects.all(), source='team', write_only=True,
        allow_null=True, required=False
    )

    class Meta:
        model = User
        fields = ['id', 'username', 'name', 'email', 'age', 'team_id', 'team_name', 'team_id_write']

    def get_id(self, obj):
        return str(obj.pk)

    def get_username(self, obj):
        return obj.email.split('@')[0]

    def get_team_id(self, obj):
        team = obj.teams.first()
        return team.pk if team else None

    def get_team_name(self, obj):
        team = obj.teams.first()
        return team.name if team else 'No Team'

    def update(self, instance, validated_data):
        new_team = validated_data.pop('team', -1)  # sentinel -1 = not provided
        instance = super().update(instance, validated_data)
        if new_team != -1:
            # Remove from all current teams then assign to new one
            for t in instance.teams.all():
                t.members.remove(instance)
            if new_team is not None:
                new_team.members.add(instance)
        return instance


class TeamSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    members = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Team
        fields = ['id', 'name', 'members']

    def get_id(self, obj):
        return str(obj.pk)


class ActivitySerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='user', write_only=True
    )

    class Meta:
        model = Activity
        fields = ['id', 'user', 'user_id', 'activity_type', 'duration', 'date']

    def get_id(self, obj):
        return str(obj.pk)


class LeaderboardSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    user = UserSerializer(read_only=True)
    team = serializers.SerializerMethodField()
    total_calories = serializers.SerializerMethodField()

    class Meta:
        model = Leaderboard
        fields = ['id', 'user', 'score', 'team', 'total_calories']

    def get_id(self, obj):
        return str(obj.pk)

    def get_team(self, obj):
        team = obj.user.teams.first()
        return team.name if team else 'No Team'

    def get_total_calories(self, obj):
        total_duration = sum(
            a.duration for a in obj.user.activities.all()
        )
        return round(total_duration * 5)


class WorkoutSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()

    class Meta:
        model = Workout
        fields = ['id', 'name', 'description', 'exercises']

    def get_id(self, obj):
        return str(obj.pk)
