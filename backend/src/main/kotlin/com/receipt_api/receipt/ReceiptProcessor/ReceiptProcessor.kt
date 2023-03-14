package com.receipt_api.receipt.ReceiptProcessor

import com.receipt_api.receipt.models.Item
import com.receipt_api.receipt.models.Receipt
import io.vertx.core.json.JsonArray
import io.vertx.core.json.JsonObject
import io.vertx.kotlin.core.json.get

object ReceiptProcessor {
  // processes a receipt object and accrues any/all points for it
  fun processReceipt(receipt: Receipt): Int {

    return -1
  }

  // parse POST JSON body to create a Receipt object
  fun fromJson(body: JsonObject): Receipt {
    val receipt = Receipt()

    body.map {
      when (it.key) {
        "retailer" -> {
          receipt.retailer = it.value.toString()
        }
        "purchaseDate" -> {
          receipt.purchaseDate = it.value.toString()
        }
        "purchaseTime" -> {
          receipt.purchaseTime = it.value.toString()
        }
        "items" -> {
          val items = it.value as JsonArray
          items.get<Any>(0)
          val itemsList: MutableList<Item> = mutableListOf()
          items.mapIndexed { index, _ ->
            val item = items.get<JsonObject>(index)
            itemsList.add(
              Item(
                shortDescription = item["shortDescription"],
                price = item["price"]
              )
            )
          }
          receipt.items = itemsList.toTypedArray()
        }
        "total" -> {
          receipt.total = it.value.toString()
        }
        else -> {
          println("Body key doesn't match any I have hardcoded")
        }
      }
    }

    return receipt
  }
}
