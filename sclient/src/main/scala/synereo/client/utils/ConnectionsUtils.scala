package synereo.client.utils

/**
  * Created by mandar.k on 6/7/2016.
  */

import shared.dtos._
import org.scalajs.dom._
import shared.sessionitems.SessionItems
import synereo.client.components.ConnectionsSelectize
import synereo.client.handlers.AckIntroductionNotification
import synereo.client.services.{CoreApi, SYNEREOCircuit}
import diode.Action
import diode.AnyAction._
import synereo.client.handlers.GotNotification
import scala.scalajs.js.timers._
import scala.util.{Failure, Success}
import scala.concurrent.ExecutionContext.Implicits.global


object ConnectionsUtils {

  /**
    * Method to get the self connection
    *
    * @param sessionUri uri of the session concerned. Look at CoreApi.scala for the
    *                   possible session uri names.
    * @return connection with the source and target to the user and label as alias
    */
  def getSelfConnnection(sessionUri: String): Connection = {
    val sessionUriSplit = sessionUri.split('/')
    val sourceStr = "agent://" + sessionUriSplit(2)
    Connection(sourceStr, "alias", sourceStr)
  }

  def getCnxsSeq(id: Option[String], sessionUriName: String): Seq[Connection] = {
    id match {
      case None =>
        Seq(ConnectionsUtils.getSelfConnnection(window.sessionStorage.getItem(sessionUriName)))
      case Some(res) =>
        Seq(ConnectionsUtils.getSelfConnnection(window.sessionStorage.getItem(sessionUriName))) ++ ConnectionsSelectize.getConnectionsFromSelectizeInput(res)
    }
  }

  //scalastyle:off
  def checkIntroductionNotification(): Unit = {
    if (window.sessionStorage.getItem("sessionPingTriggered") == null) {
      window.sessionStorage.setItem("sessionPingTriggered", "true")
      def intervalForCheckNotification(): Unit = {
        CoreApi.getConnections().onComplete {
          case Success(response) => {
            processIntroductionNotification(response)
            intervalForCheckNotification()
          }
          case Failure(failureMessage) => println(s"failureMessage: $failureMessage")
          case _ => println("something went wrong in session ping")
        }
      }
      setTimeout(7000) {
        intervalForCheckNotification()
      }
    }
  }

  def processIntroductionNotification(response: String = ""): Unit = {
    try {
      if (response.contains("sessionPong")) {
        val sessionPong = upickle.default.read[Seq[ApiResponse[SessionPong]]](response)
      }
      else if (response.contains("introductionNotification")) {
        try {
          val intro = upickle.default.read[Seq[ApiResponse[Introduction]]](response)
          SYNEREOCircuit.dispatch(GotNotification(Seq(intro(0).content)))
        } catch {
          case e: Exception =>
            println(s" exception in introductionNotification ${e.getStackTrace}")
        }
      }
    } catch {
      case e: Exception => println("into exception for upickle")
    }
  }

  // #todo think about better structure for the label prolog
  //

}

