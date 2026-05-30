import scala.util.{Failure, Random, Success, Try}

trait GameState {
  var isGameOver: Boolean
  def setGameOver(over: Boolean): Unit = {
    isGameOver = over
  }
}

trait GamePlay[T<: GameState] {
  var state: T
  protected def init(): Unit
  protected def loop(): Unit
  protected def handleEndOfGame(state: T): Unit
  def start(): Unit = {
    init()
    while (!state.isGameOver) {
      loop()
    }
    handleEndOfGame(state)
  }
}

case class UserGuess(letter: Char)
case class ComputerAnswer(word: String, revealedPosition: Int)
case class CheatingHangmanGameStateUserView(history: Array[(Int, UserGuess, Boolean)], revealedWord: String, isGameOver: Boolean)
case class CheatingHangmanGameStateComputerView(previousAnswer: String, userGuess: UserGuess, revealedWord: String, isGameOver: Boolean)
case class CheatingHangmanGameState(var history: Array[(Int, ComputerAnswer, Option[UserGuess])] = Array.empty,
                                    var isGameOver: Boolean = false) extends GameState {
  def userView: CheatingHangmanGameStateUserView = {
    val userGuesses = history.flatMap { case (index, answer, guessOpt) =>
      guessOpt.map(guess => (index, guess, answer.revealedPosition == guess.letter))
    }
    val revealedWord = history.flatMap { case (_, answer, guessOpt) =>
      guessOpt match {
        case Some(guess) if answer.revealedPosition == guess.letter => Some(answer.word)
        case _ => None
      }
    }.mkString("")
    CheatingHangmanGameStateUserView(userGuesses, revealedWord, isGameOver)
  }

  def computerView: CheatingHangmanGameStateComputerView = {
    history.lastOption match {
      case Some((_, answer, Some(guess))) =>
        CheatingHangmanGameStateComputerView(answer.word, guess, userView.revealedWord, isGameOver)
      case Some((_, answer, None)) =>
        CheatingHangmanGameStateComputerView(answer.word, UserGuess(' '), userView.revealedWord, isGameOver)
      case None =>
        CheatingHangmanGameStateComputerView("", UserGuess(' '), "", isGameOver)
    }
  }

  def addComputerAnswer(answer: ComputerAnswer): Unit = {
    val newIndex = history.size
    history = history.appended(newIndex, answer, None)
  }

  def addUserGuess(guess: UserGuess): Unit = {
    history.lastOption match {
      case Some((idx, answer, _)) =>
        history = history.updated(idx, (answer, Some(guess)))
      case None =>
        throw new IllegalStateException("No computer answer to associate with the user guess")
    }
  }
}

class HumanPlayer {
  def guess(currentView: CheatingHangmanGameStateUserView): UserGuess = {
    // Implement logic to get user input and return a UserGuess
    ???
  }
}

class ComputerPlayer(vocabulary: Set[String])(implicit random: Random) {
  def initAnswer(): ComputerAnswer = {
    // Implement logic to select a word from the vocabulary
    val selectedWord = vocabulary.toSeq(random.nextInt(vocabulary.size))
    ComputerAnswer(selectedWord, -1) // Initial answer with no revealed position
  }

  def respond(currentView: CheatingHangmanGameStateComputerView): ComputerAnswer = {
    // Implement logic to decide whether to change the word based on the user's guess and the current revealed word
    ???
  }
}

class CheatingHangman(val vocabulary: Set[String])
                     (implicit val random: Random) extends GamePlay[CheatingHangmanGameState] {

  private lazy val humanPlayer = new HumanPlayer()
  private lazy val computerPlayer = new ComputerPlayer(vocabulary)

  override var state: CheatingHangmanGameState = CheatingHangmanGameState()

  override protected def init(): Unit = {
    val initialAnswer = computerPlayer.initAnswer() // Initialize the game with a selected word
    state.addComputerAnswer(initialAnswer) // Add the initial computer answer to the state
  }

  override protected def loop(): Unit = {
    Try {
      humanPlayer.guess(state.userView)
    }.match {
      case Success(userGuess) =>
        state.addUserGuess(userGuess)
        val computerAnswer = computerPlayer.respond(state.computerView)
        state.addComputerAnswer(computerAnswer)
        if (allLettersRevealed) {
          state.setGameOver(true)
        }
      case Failure(exception) =>
        println(s"Error getting user guess: ${exception.getMessage}")
        state.setGameOver(true)
    }
  }

  private def allLettersRevealed: Boolean = {
    state.history.lastOption match {
      case Some((_, answer, None)) =>
        answer.revealedPosition + 1 == answer.word.length
      case _ => throw new IllegalStateException("No computer answer found to determine if all words are revealed")
    }
  }

  override protected def handleEndOfGame(state: CheatingHangmanGameState): Unit = {
    // Implement logic to determine if the user won or lost and display the appropriate message
    val userWon = allLettersRevealed
    if (userWon) {
      val finalRevealedWord = state.history.lastOption match {
        case Some((_, answer, None)) => answer.word
        case _ => throw new IllegalStateException("No computer answer found to determine the final revealed word")
      }
      println(s"Congratulations! You've guessed the word: $finalRevealedWord")
    } else {
      println("Game over! Better luck next time.")
    }
  }
}


object CheatingHangman {

  def main(args: Array[String]): Unit = {
    val vocabulary: Set[String] = Set(
      "cat", "car", "cow", "dog", "pig"
    )
    implicit val random: scala.util.Random = new Random()

    val game = new CheatingHangman(vocabulary)
    game.start()
  }
}
