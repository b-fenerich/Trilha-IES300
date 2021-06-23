package com.fatec.es3.game;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fatec.es3.exception.InvalidGameException;
import com.fatec.es3.exception.InvalidGamePlayException;
import com.fatec.es3.exception.InvalidParamException;
import com.fatec.es3.exception.NotFoundException;
import com.fatec.es3.game.model.Game;
import com.fatec.es3.game.model.GamePlay;
import com.fatec.es3.game.model.GameStatus;
import com.fatec.es3.game.model.Player;
import com.fatec.es3.game.model.PlayerStage;
import com.fatec.es3.game.model.Tenant;
import com.fatec.es3.game.storage.GameStorage;
import com.fatec.es3.model.User;
import com.fatec.es3.repository.UserRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class GameService {

	@Autowired
	UserRepository userRepository;

	public Game createGame(Player player, boolean privacy) throws NotFoundException {



		User user = (User) userRepository.getUserByUsername(player.getNickname());
//				.orElseThrow(() -> new NotFoundException("Player not found"));

		player.setNickname(user.getUsername());
		player.setId(user.getId());
		Game game = new Game();
		game.setGameId(UUID.randomUUID().toString());

		// Monta tabuleiro vazio
		Tenant[][] board = {
				{ Tenant.EMPTY, Tenant.INVALID, Tenant.INVALID, Tenant.EMPTY, Tenant.INVALID, Tenant.INVALID, Tenant.EMPTY },
				{ Tenant.INVALID, Tenant.EMPTY, Tenant.INVALID, Tenant.EMPTY, Tenant.INVALID, Tenant.EMPTY,	Tenant.INVALID },
				{ Tenant.INVALID, Tenant.INVALID, Tenant.EMPTY, Tenant.EMPTY, Tenant.EMPTY, Tenant.INVALID, Tenant.INVALID },
				{ Tenant.EMPTY, Tenant.EMPTY, Tenant.EMPTY, Tenant.INVALID, Tenant.EMPTY, Tenant.EMPTY, Tenant.EMPTY },
				{ Tenant.INVALID, Tenant.INVALID, Tenant.EMPTY, Tenant.EMPTY, Tenant.EMPTY, Tenant.INVALID, Tenant.INVALID },
				{ Tenant.INVALID, Tenant.EMPTY, Tenant.INVALID, Tenant.EMPTY, Tenant.INVALID, Tenant.EMPTY, Tenant.INVALID },
				{ Tenant.EMPTY, Tenant.INVALID, Tenant.INVALID, Tenant.EMPTY, Tenant.INVALID, Tenant.INVALID, Tenant.EMPTY } };

		game.setBoard(board);
		game.setPlayer1(player);
		game.setGameStatus(GameStatus.NEW);
		game.setPrivacy(privacy);

		// Armazena jogo criado na fila de jogos
		GameStorage.getInstance().setGame(game);

		return game;
	}

	public Game connectToGame(Player player2, String gameId)
			throws InvalidParamException, InvalidGameException, NotFoundException {
		if (!GameStorage.getInstance().getGames().containsKey(gameId)) {
			throw new InvalidParamException("Game with provide id dosent exist");
		}

		Game game = GameStorage.getInstance().getGames().get(gameId);

		if (game.getPlayer2() != null) {
			throw new InvalidGameException("Game is not valid anymore");
		}

		User user = (User) userRepository.getUserByUsername(player2.getNickname());
//				.orElseThrow(() -> new NotFoundException("Player not found"));

		player2.setNickname(user.getUsername());
		player2.setId(user.getId());
		game.setPlayer2(player2);
		game.setGameStatus(GameStatus.IN_PROGRESS);
		GameStorage.getInstance().setGame(game);

		return game;
	}

	public Game connectToRandomGame(Player player2) throws NotFoundException {
		// Encontra o primeiro jogo disponivel
		Game game = GameStorage.getInstance().getGames().values().stream()
				.filter(it -> it.getGameStatus().equals(GameStatus.NEW) || !it.isPrivacy()).findFirst()
				.orElseThrow(() -> new NotFoundException("Game not found"));

		User user = (User) userRepository.findById(player2.getId())
				.orElseThrow(() -> new NotFoundException("Player not found"));

		player2.setNickname(user.getUsername());

		game.setPlayer2(player2);
		game.setGameStatus(GameStatus.IN_PROGRESS);
		GameStorage.getInstance().setGame(game);

		return game;
	}

	public Game gamePlay(GamePlay gamePlay) throws NotFoundException, InvalidGameException, InvalidGamePlayException {
		// Realiza jogada
		//Confere se a partida existe, buscando sua instancia
		
		if (!GameStorage.getInstance().getGames().containsKey(gamePlay.getGameId())) {
			throw new NotFoundException("Game not found");
		}

		Game game = GameStorage.getInstance().getGames().get(gamePlay.getGameId());
		//Confere se a partida já foi encerrada (se seu GameStatus é FINISHED)
		if (game.getGameStatus().equals(GameStatus.FINISHED)) {
			throw new InvalidGameException("Game is already finished");
		}
		if(gamePlay.getType() == Tenant.PLAYER_1) gamePlay.setPlayer(game.getPlayer1());
		if(gamePlay.getType() == Tenant.PLAYER_2) gamePlay.setPlayer(game.getPlayer2());
		Tenant[][] board = game.getBoard();

		if (board[gamePlay.getCoordinateX()][gamePlay.getCoordinateY()].equals(Tenant.INVALID)) {
			throw new InvalidGamePlayException("Game is already finished");// ("Movimento inválido")
		}

//		board[gamePlay.getCoordinateX()][gamePlay.getCoordinateY()] = gamePlay.getType();
		boolean isValidMove;
		
		if(!game.isLastMoveTrinca()) {
			isValidMove = movimentar(game, gamePlay.getType(), gamePlay);
		} else {
			isValidMove = removePeca(game, gamePlay.getType(), gamePlay);
			game.setLastMoveTrinca(false);
		}
		
		if(isValidMove) game.setLastMove(gamePlay.getType());
		
		
		game.setValidMove(isValidMove);
		
		game.setBoard(board);
		GameStorage.getInstance().setGame(game);
		
		return game;

	}

	//Métodos para verificação de requisições

	public static boolean movimentar(Game game, Tenant tenant, GamePlay gamePlay) {
		int intervalo;

		//verifica se o player esta mexendo na propria peça
		if (((tenant == Tenant.PLAYER_1 && game.getPlayer1().getId() == gamePlay.getPlayer().getId()) ||
				(tenant == Tenant.PLAYER_2 && game.getPlayer2().getId() == gamePlay.getPlayer().getId())) &&
				game.getBoard()[gamePlay.getCoordinateX()][gamePlay.getCoordinateY()] == Tenant.EMPTY) {
			Tenant[][] board = game.getBoard();

			//condição de movimentação estágio 1;
			if (gamePlay.getPlayer().getEstagioPlayer() == PlayerStage.STAGE1) {
				
				board[gamePlay.getCoordinateX()][gamePlay.getCoordinateY()] = tenant;
				game.setBoard(board);
				//Verificar
				if(tenant == Tenant.PLAYER_1) {
					game.getPlayer1().setPecasPosicionadas(gamePlay.getPlayer().getPecasPosicionadas() + 1);
					game.getPlayer1().setPecasVivas(gamePlay.getPlayer().getPecasVivas() + 1);
				}
				if (tenant == Tenant.PLAYER_2) {
					game.getPlayer2().setPecasPosicionadas(gamePlay.getPlayer().getPecasPosicionadas() + 1);
					game.getPlayer2().setPecasVivas(gamePlay.getPlayer().getPecasVivas() + 1);
				}
				
				game.setLastMoveTrinca(checkTrinca(board, gamePlay.getCoordinateX(), gamePlay.getCoordinateY(), tenant));

				return true;
			}

			//condição de movimentação estágio 2;
			if (gamePlay.getPlayer().getEstagioPlayer() == PlayerStage.STAGE2) {
				if ((gamePlay.getCoordinateXAnt() != 3) && (gamePlay.getCoordinateYAnt() != 3)) {
					if (((gamePlay.getCoordinateX() == gamePlay.getCoordinateXAnt()) && (gamePlay.getCoordinateY() == 3)) || ((gamePlay.getCoordinateY() == gamePlay.getCoordinateYAnt()) && (gamePlay.getCoordinateX() == 3))) {
						board[gamePlay.getCoordinateX()][gamePlay.getCoordinateY()] = tenant;
						board[gamePlay.getCoordinateXAnt()][gamePlay.getCoordinateYAnt()] = Tenant.EMPTY;
						game.setBoard(board);
						
						game.setLastMoveTrinca(checkTrinca(board, gamePlay.getCoordinateX(), gamePlay.getCoordinateY(), tenant));
						return true;
					}

				} else if ((gamePlay.getCoordinateXAnt() == 3)) {
					intervalo = Math.abs(gamePlay.getCoordinateXAnt() - gamePlay.getCoordinateYAnt());
					if (gamePlay.getCoordinateX() == (gamePlay.getCoordinateXAnt() + intervalo) || gamePlay.getCoordinateX() == (gamePlay.getCoordinateXAnt() - intervalo) && (gamePlay.getCoordinateYAnt() == gamePlay.getCoordinateY())) {
						board[gamePlay.getCoordinateX()][gamePlay.getCoordinateY()] = tenant;
						board[gamePlay.getCoordinateXAnt()][gamePlay.getCoordinateYAnt()] = Tenant.EMPTY;
						game.setBoard(board);
						
						game.setLastMoveTrinca(checkTrinca(board, gamePlay.getCoordinateX(), gamePlay.getCoordinateY(), tenant));
						return true;

					}
					if ((gamePlay.getCoordinateYAnt() == 1) || (gamePlay.getCoordinateYAnt() == 5)) {
						if (gamePlay.getCoordinateY() == (gamePlay.getCoordinateYAnt() + 1) || gamePlay.getCoordinateY() == (gamePlay.getCoordinateYAnt() - 1) && (gamePlay.getCoordinateXAnt() == gamePlay.getCoordinateX())) {
							board[gamePlay.getCoordinateX()][gamePlay.getCoordinateY()] = tenant;
							board[gamePlay.getCoordinateXAnt()][gamePlay.getCoordinateYAnt()] = Tenant.EMPTY;
							game.setBoard(board);
							
							game.setLastMoveTrinca(checkTrinca(board, gamePlay.getCoordinateX(), gamePlay.getCoordinateY(), tenant));
							return true;
						}

					} else if ((gamePlay.getCoordinateYAnt() == 0) || (gamePlay.getCoordinateYAnt() == 4)) {
						if (gamePlay.getCoordinateY() == (gamePlay.getCoordinateYAnt() + 1) && (gamePlay.getCoordinateXAnt() == gamePlay.getCoordinateX())) {
							board[gamePlay.getCoordinateX()][gamePlay.getCoordinateY()] = tenant;
							board[gamePlay.getCoordinateXAnt()][gamePlay.getCoordinateYAnt()] = Tenant.EMPTY;
							game.setBoard(board);
							
							game.setLastMoveTrinca(checkTrinca(board, gamePlay.getCoordinateX(), gamePlay.getCoordinateY(), tenant));
							return true;
						}

					} else if ((gamePlay.getCoordinateYAnt() == 2) || (gamePlay.getCoordinateYAnt() == 6)) {
						if (gamePlay.getCoordinateY() == (gamePlay.getCoordinateYAnt() - 1) && (gamePlay.getCoordinateXAnt() == gamePlay.getCoordinateX())) {
							board[gamePlay.getCoordinateX()][gamePlay.getCoordinateY()] = tenant;
							board[gamePlay.getCoordinateXAnt()][gamePlay.getCoordinateYAnt()] = Tenant.EMPTY;
							game.setBoard(board);
							
							game.setLastMoveTrinca(checkTrinca(board, gamePlay.getCoordinateX(), gamePlay.getCoordinateY(), tenant));
							return true;
						}
					}
				} else if ((gamePlay.getCoordinateYAnt() == 3)) {
					intervalo = Math.abs(gamePlay.getCoordinateXAnt() - gamePlay.getCoordinateYAnt());
					if (gamePlay.getCoordinateY() == (gamePlay.getCoordinateYAnt() + intervalo) || gamePlay.getCoordinateY() == (gamePlay.getCoordinateYAnt() - intervalo) && (gamePlay.getCoordinateXAnt() == gamePlay.getCoordinateX())) {
						board[gamePlay.getCoordinateX()][gamePlay.getCoordinateY()] = tenant;
						board[gamePlay.getCoordinateXAnt()][gamePlay.getCoordinateYAnt()] = Tenant.EMPTY;
						game.setBoard(board);
						
						game.setLastMoveTrinca(checkTrinca(board, gamePlay.getCoordinateX(), gamePlay.getCoordinateY(), tenant));
						return true;

					}
					if ((gamePlay.getCoordinateXAnt() == 1) || (gamePlay.getCoordinateXAnt() == 5)) {
						if (gamePlay.getCoordinateX() == (gamePlay.getCoordinateXAnt() + 1) || gamePlay.getCoordinateX() == (gamePlay.getCoordinateXAnt() - 1) && (gamePlay.getCoordinateYAnt() == gamePlay.getCoordinateY())) {
							board[gamePlay.getCoordinateX()][gamePlay.getCoordinateY()] = tenant;
							board[gamePlay.getCoordinateXAnt()][gamePlay.getCoordinateYAnt()] = Tenant.EMPTY;
							game.setBoard(board);
							
							game.setLastMoveTrinca(checkTrinca(board, gamePlay.getCoordinateX(), gamePlay.getCoordinateY(), tenant));
							return true;
						}
					} else if ((gamePlay.getCoordinateXAnt() == 0) || (gamePlay.getCoordinateXAnt() == 4)) {
						if (gamePlay.getCoordinateX() == (gamePlay.getCoordinateXAnt() + 1) && (gamePlay.getCoordinateYAnt() == gamePlay.getCoordinateY())) {
							board[gamePlay.getCoordinateX()][gamePlay.getCoordinateY()] = tenant;
							board[gamePlay.getCoordinateXAnt()][gamePlay.getCoordinateYAnt()] = Tenant.EMPTY;
							game.setBoard(board);
							
							game.setLastMoveTrinca(checkTrinca(board, gamePlay.getCoordinateX(), gamePlay.getCoordinateY(), tenant));
							return true;
						}

					} else if ((gamePlay.getCoordinateXAnt() == 2) || (gamePlay.getCoordinateXAnt() == 6)) {
						if (gamePlay.getCoordinateX() == (gamePlay.getCoordinateXAnt() - 1) && (gamePlay.getCoordinateYAnt() == gamePlay.getCoordinateY())) {
							board[gamePlay.getCoordinateX()][gamePlay.getCoordinateY()] = tenant;
							board[gamePlay.getCoordinateXAnt()][gamePlay.getCoordinateYAnt()] = Tenant.EMPTY;
							game.setBoard(board);
							
							game.setLastMoveTrinca(checkTrinca(board, gamePlay.getCoordinateX(), gamePlay.getCoordinateY(), tenant));
							
							
							
							return true;
						}
					}
				}

			}

			//condição de movimentação estágio 3;
			if (gamePlay.getPlayer().getEstagioPlayer() == PlayerStage.STAGE3) {
				board[gamePlay.getCoordinateX()][gamePlay.getCoordinateY()] = tenant;
				board[gamePlay.getCoordinateXAnt()][gamePlay.getCoordinateYAnt()] = Tenant.EMPTY;
				game.setBoard(board);
				if(checkTrinca(board, gamePlay.getCoordinateX(), gamePlay.getCoordinateY(), tenant)) {
					game.setLastMoveTrinca(true);
				}
				return true;
			}

		}

		return false;
	}


	public static boolean checkTrincaHorizontal(Tenant[][] boardState, int linha, int coluna, Tenant player) {

		int interval = -1;

//		calculo para achar o intervalo
		if(linha < 3) interval = 3 - linha;
		if(linha > 3) interval = linha - 3;
		if(linha == 3) interval = 1;


		//Define se peça foi colocada na esquerda, meio ou direita da possivel trinca
		int meio;

		if(coluna - interval < 0 || boardState[linha][coluna - interval] == Tenant.INVALID) meio = - 1;
		else if(coluna + interval > 6 || boardState[linha][coluna + interval] == Tenant.INVALID) meio = 1;
		else meio = 0;
		//

		//Verificação da trinca
		switch (meio) {
			case -1:
				if(boardState[linha][coluna + interval].getValue() == player.getValue() && boardState[linha][coluna + (interval * 2)].getValue() == player.getValue())
					return true;
				break;
			case 0:
				if(boardState[linha][coluna - interval].getValue() == player.getValue() && boardState[linha][coluna + interval].getValue() == player.getValue())
					return true;
				break;
			case 1:
				if(boardState[linha][coluna - interval].getValue() == player.getValue() && boardState[linha][coluna - (interval * 2)].getValue() == player.getValue())
					return true;
				break;


		}
		return false;

	}

	public static boolean checkTrincaVertical(Tenant[][] boardState, int linha, int coluna, Tenant player) {

		int interval = -1;

//		calculo para achar o intervalo
		if(coluna < 3) interval = 3 - coluna;
		if(coluna > 3) interval = coluna - 3;
		if(coluna == 3) interval = 1;


		//Define se peça foi colocada na esquerda, meio ou direita da possivel trinca
		int meio;

		if(linha - interval < 0 || boardState[linha - interval][coluna] == Tenant.INVALID) meio = - 1;
		else if(linha + interval > 6 || boardState[linha + interval][coluna] == Tenant.INVALID) meio = 1;
		else meio = 0;
		//

		//Verificação da trinca
		switch (meio) {
			case -1:
				if(boardState[linha + interval][coluna].getValue() == player.getValue() && boardState[linha + (interval * 2)][coluna ].getValue() == player.getValue())
					return true;
				break;
			case 0:
				if(boardState[linha - interval][coluna].getValue() == player.getValue() && boardState[linha + interval][coluna].getValue() == player.getValue())
					return true;
				break;
			case 1:
				if(boardState[linha - interval][coluna].getValue() == player.getValue() && boardState[linha - (interval * 2)][coluna].getValue() == player.getValue())
					return true;
				break;


		}
		return false;
	}

	public static boolean checkTrinca(Tenant[][] boardState, int linha, int coluna, Tenant player) {
		return (checkTrincaVertical(boardState, linha, coluna, player) || checkTrincaHorizontal(boardState, linha, coluna, player));
	}

	private boolean removePeca(Game game, Tenant tenant, GamePlay gamePlay) {
		if (tenant == Tenant.PLAYER_1 && (game.getBoard()[gamePlay.getCoordinateX()][gamePlay.getCoordinateY()] == Tenant.PLAYER_2)) {
			
			game.getBoard()[gamePlay.getCoordinateX()][gamePlay.getCoordinateY()] = Tenant.EMPTY;
			game.getPlayer2().setPecasVivas(game.getPlayer2().getPecasVivas() -1);
			return true;
		} else if (tenant == Tenant.PLAYER_2 && (game.getBoard()[gamePlay.getCoordinateX()][gamePlay.getCoordinateY()] == Tenant.PLAYER_1)) {
			game.getBoard()[gamePlay.getCoordinateX()][gamePlay.getCoordinateY()] = Tenant.EMPTY;
			game.getPlayer1().setPecasVivas(game.getPlayer1().getPecasVivas() -1);
			return true;
		}
		return false;
	}





}
