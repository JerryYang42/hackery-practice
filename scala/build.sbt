ThisBuild / scalaVersion := "2.13.10"
ThisBuild / version      := "0.1.0-SNAPSHOT"

lazy val wordle = project
  .in(file("wordle"))
  .settings(
    name := "wordle",
    libraryDependencies += "org.scalatest" %% "scalatest" % "3.2.17" % Test
  )

lazy val dawkinsWeasel = project
  .in(file("dawkins-weasel"))
  .settings(
    name := "dawkins-weasel",
    libraryDependencies += "org.scalatest" %% "scalatest" % "3.2.17" % Test
  )

lazy val root = project
  .in(file("."))
  .aggregate(wordle, dawkinsWeasel)
  .settings(
    name := "scala-practice"
  )

