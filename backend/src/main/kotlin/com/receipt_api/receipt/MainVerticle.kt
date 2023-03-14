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

  override fun start(startPromise: Promise<Void>) {
    // Create a Router
    // Create router endpoints
    val router = Router.router(vertx).apply {
      post("/receipts/process").handler(BodyHandler.create()).handler(this@MainVerticle::processReceipt)
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
    // test Receipt Object
//    val itemss: Array<Item> = arrayOf(
//      Item(
//        shortDescription = "Mountain Dew 12PK",
//        price = "6.49"
//      ),
//    )
//    val receipt = Receipt(
//      id = "blahhhh",
//      retailer = "Target",
//      purchaseDate = "2022-01-01",
//      purchaseTime = "13:01",
//      items = itemss,
//      total = "6.49",
//      points = "12"
//    )

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
    println(receipt)

    context.response().statusCode = 200

    context.response().putHeader("Content-Type", "application/json")
    context.response().end("Testing")
  }
}
