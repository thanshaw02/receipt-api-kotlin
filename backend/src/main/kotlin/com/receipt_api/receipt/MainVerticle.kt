package com.receipt_api.receipt

import com.receipt_api.receipt.ReceiptProcessor.ReceiptProcessor
import io.vertx.core.AbstractVerticle
import io.vertx.core.Promise
import io.vertx.core.json.JsonObject
import io.vertx.ext.web.Router
import io.vertx.ext.web.RoutingContext
import io.vertx.ext.web.handler.BodyHandler
import io.vertx.ext.web.handler.CorsHandler
import io.vertx.kotlin.core.json.json
import io.vertx.kotlin.core.json.obj
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

class MainVerticle : AbstractVerticle() {
  private var inMemoryCache: MutableMap<String, Int> = mutableMapOf()

  override fun start(startPromise: Promise<Void>) {

    val router = Router.router(vertx)

    // Allow all origins (not secure but works for now)
    router.route().handler(CorsHandler.create("*"))

    // Create router endpoints
    router.apply {
      post("/receipts/process").handler(BodyHandler.create()).handler(this@MainVerticle::processReceipt)
      get("/receipts/:id/points").handler(BodyHandler.create()).handler(this@MainVerticle::getReceiptPointsById)
    }

    // Create the HTTP server
    vertx.createHttpServer()
      // Handle every request using the router
      .requestHandler(router)
      // Start listening
      .listen(8000)
      // Print the port
      .onSuccess { server ->
        println("HTTP server started on port " + server.actualPort())
      }
  }

  private fun processReceipt(context: RoutingContext) {
    val body = context.getBodyAsJson();
    body ?: run {
      // handle an empty request here
      serverLog("error reading request body")
      context.response().statusCode = 400
      context.response().putHeader("X-Receipt-Missing-Data", "true")
      context.response().putHeader("Content-Type", "application/json")
      context.json(JsonObject().put("error", "POST body is missing required data"))
      return
    }

    try {
      // create receipt object
      // this approach isn't great, i can't import "gson" so i have to do this by hand for now
      val receipt = ReceiptProcessor.fromJson(body)

      //println(receipt) // debugging

      // process receipt object and store it in memory
      val receiptPoints = ReceiptProcessor.processReceipt(receipt)
      inMemoryCache[receipt.id] = receiptPoints

      serverLog("successfully created and stored receipt, returning receipt id \"${receipt.id}\"")

      context.response().statusCode = 200
      context.response().putHeader("Content-Type", "application/json")
      context.json(JsonObject().put("id", receipt.id))
    } catch (e: Error) {
      // handle missing attributes in request here
      val cause = e.cause?.message
      val message = e.message

      serverLog(message ?: cause ?: "missing required attribute types in request body")

      context.response().statusCode = 400
      context.response().putHeader("X-Receipt-Missing-Data", cause)
      context.response().putHeader("Content-Type", "application/json")
      context.json(JsonObject().put("error", message))
    }
  }

  private fun getReceiptPointsById(context: RoutingContext) {
    val pathParamId = context.pathParam("id")

    pathParamId ?: run {
      serverLog("error in GET path -- missing required receipt id")
      context.response().statusCode = 400
      context.response().putHeader("X-Missing-Filed", "no path \"ID\"")
      context.response().putHeader("Content-Type", "application/json")
      context.json(JsonObject().put("error", "please provide an id in the path"))
    }

    val foundReceipt = inMemoryCache[pathParamId]
    foundReceipt ?: run {
      serverLog("error fetching receipt points with id \"${pathParamId}\"")
      context.response().statusCode = 404
      context.response().putHeader("X-Receipt-Not-Exist", pathParamId)
      context.response().putHeader("Content-Type", "application/json")
      context.json(JsonObject().put("error", "receipt not found with id"))
      return
    }

    serverLog("successfully fetched receipt, returning receipt points \"${foundReceipt}\"")

    context.response().statusCode = 200
    context.response().putHeader("Content-Type", "application/json")
    context.json(JsonObject().put("points", foundReceipt))
  }

  // NOTE: I'm using index 2 here because that is the previous context prior to this method being called
  private fun serverLog(message: String) {
    val serverLogDateFormat = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:SS")
    val serverLogDate = LocalDateTime.now().format(serverLogDateFormat)
    val loggingFromMethod = Thread.currentThread().stackTrace[2].methodName
    println("LOG $serverLogDate [ ${loggingFromMethod}: $message ]")
  }
}
