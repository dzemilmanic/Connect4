from rest_framework import serializers
from .models import Game, GameMove

class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = ['id', 'board_state', 'current_player', 'is_finished', 
                 'winner', 'winning_cells', 'game_type', 'difficulty', 
                 'created_at', 'updated_at']

class GameMoveSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameMove
        fields = ['id', 'game', 'column', 'player', 'created_at']