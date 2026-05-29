package wordle

import scala.collection.mutable.ListBuffer

class WordGuess(word: String) {
  private val answer = word
  private val state = {
    val temp: ListBuffer[LetterGuess] = ListBuffer()
    word.toLowerCase.toCharArray.foreach(chr => temp += new LetterGuess(chr.toString))
    temp.toList
  }

  def attempt(guess: String): List[LetterGuess] = {
    val result = new ListBuffer[LetterGuess]
    for (i <- Range(0, answer.length)) yield {
      val letterGuessStatus = {
        if (answer.contains(guess(i))) {
          if (answer(i) == guess(i)) GuessCorrect
          else GuessWrongPosition
        } else GuessWrong
      }
      result += new LetterGuess(guess(i).toString, letterGuessStatus)
    }
    result.toList
  }
}
