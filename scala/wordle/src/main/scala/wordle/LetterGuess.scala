package wordle

sealed trait LetterGuessStatus
object GuessNotStarted    extends LetterGuessStatus
object GuessWrong         extends LetterGuessStatus  // Aren't in the word
object GuessWrongPosition extends LetterGuessStatus  // Are in the word and in the wrong place
object GuessCorrect       extends LetterGuessStatus  // Are in the word and in the right place

class InvalidStateTransfer(s: String) extends Exception(s)

class LetterGuess(letter: String, initState: LetterGuessStatus) {
  private var state = initState

  def this(letter: String) = {
    this(letter, GuessNotStarted)
  }

  private def changeState(toState: LetterGuessStatus): Unit = {
    //    this.state = toState

    // IMPROVE: refine state transfer, prevent players from getting worse?
    def throwInvalidStateTransferException(): Unit =
      throw new InvalidStateTransfer(s"Letter ${letter} cannot transfer from ${state} to ${toState}")

    state match {
      case GuessNotStarted =>
        toState match {
          case GuessWrong | GuessWrongPosition | GuessCorrect => state = toState
          case _ => throwInvalidStateTransferException
        }
      case GuessWrong => {
        toState match {
          case GuessWrongPosition | GuessCorrect => state = toState
          case _ => throwInvalidStateTransferException
        }
      }
      case GuessWrongPosition => {
        toState match {
          case GuessCorrect => state = toState
          case _ => throwInvalidStateTransferException
        }
      }
      case GuessCorrect => throwInvalidStateTransferException
    }
  }

  override def toString: String = s"${letter} status: ${state}"
}

