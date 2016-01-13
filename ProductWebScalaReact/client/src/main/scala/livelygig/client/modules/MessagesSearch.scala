package livelygig.client.modules

import japgolly.scalajs.react.extra.router.RouterCtl
import japgolly.scalajs.react.vdom.prefix_<^._
import japgolly.scalajs.react.{Callback, ReactComponentB}
import livelygig.client.LGMain.Loc
import livelygig.client.LGMain.Loc
import livelygig.client.components._
import livelygig.client.css._


import scalacss.ScalaCssReact._

object MessagesSearch {
  // create the React component for Dashboard
  val component = ReactComponentB[RouterCtl[Loc]]("Messages")
    .render_P(ctl =>
      // todo: Need to parameterize on type (e.g. Talent, Project) and preset (e.g. Recommended Mathces)
      "talentPreset1" match {
        case "talentPreset1" =>
          <.div(^.id:="slctScrollContainer", DashBoardCSS.Style.slctContainer)(
            <.div(LftcontainerCSS.Style.fontsize12em,LftcontainerCSS.Style.slctsearchpanelabelposition)(

              <.div(DashBoardCSS.Style.slctHeaders)("Search Criteria"),
              <.div(^.className:="row")(
                <.div(^.className:="col-md-12 col-sm-12 col-xs-12",MessagesCSS.Style.slctMessagesInputWidth)(
                  <.div("From Date")
                  //                        <.span(^.className:="checkbox-lbl")
                ),
                <.div(MessagesCSS.Style.slctMessagesInputLeftContainerMargin)(
                  <.input(^.className:="form-control", DashBoardCSS.Style.inputHeightWidth)
                )
              ),
              <.div(^.className:="row")(
                <.div(^.className:="col-md-12 col-sm-12 col-xs-12",MessagesCSS.Style.slctMessagesInputWidth)(
                  <.div("Before Date")
                  //                        <.span(^.className:="checkbox-lbl")
                ),
                <.div(MessagesCSS.Style.slctMessagesInputLeftContainerMargin)(
                  <.input(^.className:="form-control", DashBoardCSS.Style.inputHeightWidth)
                )
              ),
              <.div(^.className:="row")(
                <.div(^.className:="col-md-12 col-sm-12 col-xs-12",MessagesCSS.Style.slctMessagesInputWidth)(
                  <.div("From Time")
                  //                        <.span(^.className:="checkbox-lbl")
                ),
                <.div(MessagesCSS.Style.slctMessagesInputLeftContainerMargin)(
                  <.input(^.className:="form-control", DashBoardCSS.Style.inputHeightWidth)
                )
              ),
              <.div(^.className:="row")(
                <.div(^.className:="col-md-12 col-sm-12 col-xs-12",MessagesCSS.Style.slctMessagesInputWidth)(
                  <.div("Keywords")
                  //                        <.span(^.className:="checkbox-lbl")
                ),
                <.div(MessagesCSS.Style.slctMessagesInputLeftContainerMargin)(
                  <.input(^.`type` := "textarea",ProjectCSS.Style.textareaWidth,^.lineHeight:= 4, DashBoardCSS.Style.marginTop10px)
                )
              ),
              <.div(DashBoardCSS.Style.slctHeaders)("Posted By"),
              <.div (LftcontainerCSS.Style.slctleftcontentdiv ,LftcontainerCSS.Style.resizable,^.id:="resizablecontainerskills")(
              ),

              <.button(^.tpe := "button",^.className:="btn btn-default", DashBoardCSS.Style.floatRightbtn,"Search")
            ))
      })
    .componentDidMount(scope => Callback {

    })
    .build
}