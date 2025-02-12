from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Game, GameMove
from .serializers import GameSerializer, GameMoveSerializer
from .agents import MinimaxABAgent, NegascoutAgent
import datetime

class GameViewSet(viewsets.ModelViewSet):
    queryset = Game.objects.all()
    serializer_class = GameSerializer

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            # Initialize empty board
            board = [[0 for _ in range(7)] for _ in range(6)]
            serializer.validated_data['board_state'] = board
            serializer.validated_data['winning_cells'] = []
            game = serializer.save()

            # Apply initial moves if provided
            initial_moves = request.data.get('initial_moves', [])
            from_file = request.data.get('from_file', False)
            
            if initial_moves and from_file:
                for move in initial_moves:
                    if not self.is_valid_move(game.board_state, move):
                        game.delete()
                        return Response(
                            {"error": f"Invalid move {move} in initial moves"},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                    # Apply move without triggering computer response
                    self.apply_move(game, move, from_file=True)
                    if game.is_finished:
                        break

            # Only make first computer move if no initial moves were provided and not from file
            elif game.game_type == 'computer-computer' and not from_file:
                algorithm = request.data.get('algorithm', 'minimax')
                agent = self.get_computer_agent(algorithm, game.difficulty)
                computer_move = agent.get_chosen_column(game.board_state)
                self.apply_move(game, computer_move)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def make_move(self, request, pk=None):
        game = self.get_object()

        if game.is_finished:
            return Response({"error": "Game is already finished"}, status=status.HTTP_400_BAD_REQUEST)

        column = request.data.get('column')
        algorithm = request.data.get('algorithm', 'minimax')
        from_file = request.data.get('is_from_file', False)
        skip_computer_move = request.data.get('skip_computer_move', False)
        
        if game.game_type == 'computer-computer':
            # For computer vs computer with file moves
            if from_file and column is not None:
                if not self.is_valid_move(game.board_state, column):
                    return Response({"error": "Invalid move from file"}, status=status.HTTP_400_BAD_REQUEST)
                self.apply_move(game, column, from_file=True)
            # Only calculate computer move if not from file and not skipping computer moves
            elif not from_file and not skip_computer_move:
                agent = self.get_computer_agent(algorithm, game.difficulty)
                column = agent.get_chosen_column(game.board_state)
                if column is not None:
                    self.apply_move(game, column)
            
        elif game.game_type == 'human-computer':
            if not self.is_valid_move(game.board_state, column):
                return Response({"error": "Invalid move"}, status=status.HTTP_400_BAD_REQUEST)
            
            # Apply human move
            self.apply_move(game, column, from_file=from_file)
            
            # Only make computer move if not from file and not skipping computer moves
            if not game.is_finished and not from_file and not skip_computer_move:
                agent = self.get_computer_agent(algorithm, game.difficulty)
                computer_move = agent.get_chosen_column(game.board_state)
                if computer_move is not None:
                    self.apply_move(game, computer_move)
                    
        else:  # human vs human
            if not self.is_valid_move(game.board_state, column):
                return Response({"error": "Invalid move"}, status=status.HTTP_400_BAD_REQUEST)
            self.apply_move(game, column, from_file=from_file)

        serializer = self.get_serializer(game)
        return Response(serializer.data)

    def get_computer_agent(self, algorithm, difficulty):
        depth = {'easy': 1, 'medium': 4, 'expert': 7}.get(difficulty)
        if depth is None:
            raise ValueError('Invalid difficulty level')
        if algorithm == 'negascout':
            return NegascoutAgent(depth)
        elif algorithm == 'minimax':
            return MinimaxABAgent(depth)
        else:
            raise ValueError('Invalid algorithm type')

    def is_valid_move(self, board, column):
        if column is None or not isinstance(column, (int, float)) or column < 0 or column >= 7:
            return False
        return board[0][column] == 0

    def apply_move(self, game, column, from_file=False):
        board = game.board_state
        current_player = game.current_player
        
        for row in range(5, -1, -1):
            if board[row][column] == 0:
                board[row][column] = current_player
                break

        game.board_state = board

        # Check for win or draw
        is_win, winning_cells = self.check_win(board, current_player)
        if is_win:
            game.is_finished = True
            game.winner = current_player
            game.winning_cells = winning_cells
        elif self.is_board_full(board):
            game.is_finished = True
            game.winning_cells = []
        else:
            game.current_player = 3 - current_player

        game.save()

        # Record move
        GameMove.objects.create(
            game=game,
            column=column,
            player=current_player
        )
        
        # Only record to file if not reading from file
        if not from_file:
            self.record_move_to_file(game.id, column, current_player)

    def record_move_to_file(self, game_id, column, player):
        move_record = f"Game ID: {game_id}, Player: {player}, Column: {column}, Time: {datetime.datetime.now()}\n"
        with open('igre.txt', 'a') as file:
            file.write(move_record)

    def check_win(self, board, player):
        # Check horizontal
        for row in range(6):
            for col in range(4):
                if all(board[row][col + i] == player for i in range(4)):
                    return True, [(row, col + i) for i in range(4)]

        # Check vertical
        for row in range(3):
            for col in range(7):
                if all(board[row + i][col] == player for i in range(4)):
                    return True, [(row + i, col) for i in range(4)]

        # Check diagonal (positive slope)
        for row in range(3):
            for col in range(4):
                if all(board[row + i][col + i] == player for i in range(4)):
                    return True, [(row + i, col + i) for i in range(4)]

        # Check diagonal (negative slope)
        for row in range(3, 6):
            for col in range(4):
                if all(board[row - i][col + i] == player for i in range(4)):
                    return True, [(row - i, col + i) for i in range(4)]

        return False, []

    def is_board_full(self, board):
        return all(cell != 0 for row in board for cell in row)

    @action(detail=True, methods=['post'])
    def get_best_move(self, request, pk=None):
        game = self.get_object()
        algorithm = request.data.get('algorithm')
        difficulty = request.data.get('difficulty')
        depth = {'easy': 1, 'medium': 4, 'expert': 7}.get(difficulty, None)
        
        if algorithm == "negascout":
            agent = NegascoutAgent(depth=depth)
        else:  # Default to Minimax
            agent = MinimaxABAgent(depth=depth)

        best_move = agent.get_chosen_column(game.board_state)
        return Response({"best_move": best_move})

    @action(detail=False, methods=['delete'])
    def delete_all(self, request):
        """
        Delete all games.
        """
        deleted_count, _ = Game.objects.all().delete()
        return Response({"message": f"Deleted {deleted_count} games."}, status=status.HTTP_204_NO_CONTENT)