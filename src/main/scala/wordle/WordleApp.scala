package wordle

import scala.collection.mutable.ListBuffer
import scala.io.StdIn.readLine
import scala.util.Random

object WordleApp {
  private val WORD_LEN = 5
  private val MAX_ROUND = 6
  private val pool: ListBuffer[String] = ListBuffer("Hello", "World")  // TODO: reimplement it using file io and lazy init

  private val guessedWords: ListBuffer[String] = new ListBuffer()
  private val currentWord: String = pickWord
  private val wordGuess: WordGuess = new WordGuess(currentWord)


  def start(args: Array[String]): Unit = {
    println("Initializing")
    init
    println("Wordle Start")
    gameLoop(MAX_ROUND)
    cleanup
  }

  private def init(): Unit = {
    // read txt file,
    // filter out all 5-letter word
    // load it into a lazy initialized string list

    // pick one word

    // initialise guessing status

    // remove from pool
    // TODO: memories word that has been guessed, persistent it in a file.
    // give player option to clear the record: ClearHistory: Boolean

  }

  private def gameLoop(maxRounds: Int): Unit = {
    for (round <- Range(0, MAX_ROUND)) yield {
      println(s"***** ${round + 1} round of guessing *****")
      var guess = ""
      do {
        println(s"Enter your guess: (5-letter word please)")
        guess = readLine().stripMargin.toLowerCase
      } while (guess.length != WORD_LEN)
      val result = wordGuess.attempt(guess)
      println(result)
      // TODO: map the result with following logic
      
    }
  }

  private def cleanup(): Unit = {
    // TODO: memories word that has been guessed, persistent it in a file.
  }

  class InvalidEmptyPool(s: String) extends Exception(s)

  private def pickWord(): String = {
    if (pool.size == 0) throw new InvalidEmptyPool("Pool is empty")
    val idx = Random.nextInt(pool.size)
    val word = pool(idx)
    guessedWords += word
    pool.remove(idx)
    word
  }
}

object Main {
  def main(args: Array[String]): Unit = {
    print(
      """
        |Hello. Ready to Wordle???
        |""".stripMargin
    )
    WordleApp.start(args)
  }
}