package com.receipt_api.receipt

import com.receipt_api.receipt.ReceiptProcessor.ReceiptProcessor
import io.vertx.core.AbstractVerticle
import io.vertx.core.Promise
import io.vertx.ext.web.Router
import io.vertx.ext.web.RoutingContext
import io.vertx.ext.web.handler.BodyHandler
import io.vertx.kotlin.core.json.json
import io.vertx.kotlin.core.json.obj

class MainVerticle : AbstractVerticle() {
  private var inMemoryCache: MutableMap<String, Int> = mutableMapOf()

  override fun start(startPromise: Promise<Void>) {

    // Create router endpoints
    val router = Router.router(vertx).apply {
      post("/receipts/process").handler(BodyHandler.create()).handler(this@MainVerticle::processReceipt)
      get("/receipts/:id/points").handler(BodyHandler.create()).handler(this@MainVerticle::getReceiptPointsById)
    }

    // Create the HTTP server
    vertx.createHttpServer()
      // Handle every request using the router
      .requestHandler(router)
      // Start listening
      .listen(8888)
      // Print the port
      .onSuccess { server ->
        println("HTTP server started on port " + server.actualPort())
      }
  }

  private fun processReceipt(context: RoutingContext) {
    val body = context.getBodyAsJson();
    body ?: run {
      // handle an empty request here
      context.response().statusCode = 400
      context.response().putHeader("x-receipt-missing-data", "true")
      context.response().putHeader("Content-Type", "application/json")
      context.response().end("{ \"error\": \"POST body is missing required data\" }")
      return
    }

    try {
      // create receipt object
      // this way sucks, i can't import "gson" so i have to do this by hand for now
      val receipt = ReceiptProcessor.fromJson(body)
      println(receipt)

      // process receipt object and store it in memory
      val receiptPoints = ReceiptProcessor.processReceipt(receipt)
      inMemoryCache[receipt.id] = receiptPoints

      context.response().statusCode = 200
      context.response().putHeader("Content-Type", "application/json")
      context.response().end("{ \"id\": ${receipt.id} }")
    } catch (e: Error) {
      val cause = e.cause?.message
      val message = e.message

      context.response().statusCode = 400
      context.response().putHeader("x-receipt-missing-data", cause)
      context.response().putHeader("Content-Type", "application/json")
      context.response().end("{ \"error\": \"$message\" }")
    }
  }

  private fun getReceiptPointsById(context: RoutingContext) {
    val pathParamId = context.pathParam("id")

    val foundReceipt = inMemoryCache[pathParamId]
    foundReceipt ?: run {
      context.response().statusCode = 404
      context.response().putHeader("x-receipt-not-exist", pathParamId)
      context.response().putHeader("Content-Type", "application/json")
      context.response().end("{ \"error\": \"receipt not found\" }")
      return
    }

    context.response().statusCode = 200
    context.response().putHeader("Content-Type", "application/json")
    context.response().end("{ \"points\": $foundReceipt }")
  }
}
