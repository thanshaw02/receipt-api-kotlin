package com.receipt_api.receipt

import com.receipt_api.receipt.ReceiptProcessor.ReceiptProcessor
import com.receipt_api.receipt.models.Item
import com.receipt_api.receipt.models.Receipt
import io.vertx.core.AbstractVerticle
import io.vertx.core.Promise
import io.vertx.core.json.JsonObject
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

    // Mount the handler for all incoming requests at every path and HTTP method
    router.route().handler { context ->
      // Get the address of the request
      val address = context.request().connection().remoteAddress().toString()
      // Get the query parameter "name"
      val queryParams = context.queryParams()
      val name = queryParams.get("name") ?: "unknown"
      // Write a json response
      context.json(
        json {
          obj(
            "name" to name,
            "address" to address,
            "message" to "Hello $name connected from $address"
          )
        }
      )
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
      context.response().putHeader("Content-Type", "application/json")
      context.response().end("{ error: \"POST body is missing required data\" }")
      return
    }

    // create receipt object
    // this way sucks, i can't import "gson" so i have to do this by hand for now
    val receipt = ReceiptProcessor.fromJson(body)

    // process receipt object and store it in memory
    val receiptPoints = ReceiptProcessor.processReceipt(receipt)
    inMemoryCache[receipt.id] = receiptPoints

    context.response().statusCode = 200
    context.response().putHeader("Content-Type", "application/json")
    context.response().end("{ \"id\": ${receipt.id} }")
  }

  private fun getReceiptPointsById(context: RoutingContext) {
    val pathParamId = context.pathParam("id")

    val foundReceipt = inMemoryCache[pathParamId]
    if (foundReceipt == null) {
      context.response().statusCode = 404
      context.response().putHeader("x-receipt-not-exist", pathParamId)
      context.response().write("{ \"error\": \"receipt not found\" }")
    }

    context.response().statusCode = 200
    context.response().putHeader("Content-Type", "application/json")
    context.response().end("{ \"points\": $foundReceipt }")
  }
}
