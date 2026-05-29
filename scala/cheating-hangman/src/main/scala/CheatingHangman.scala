import scala.util.Random

trait Game {
  def start(): Unit
}

class CheatingHangman(val vocabulary: Set[String])
                     (implicit val random: Random) extends Game {

  override def start(): Unit = ???
}

object CheatingHangman {
  val vocabulary: Set[String] = Set(
    "cat", "car", "cow", "dog", "pig"
  )
  implicit val random: scala.util.Random = new Random()

  val game = new CheatingHangman(vocabulary)
  game.start()
}