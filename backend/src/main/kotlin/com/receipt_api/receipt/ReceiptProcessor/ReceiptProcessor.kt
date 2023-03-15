package com.receipt_api.receipt.ReceiptProcessor

import com.receipt_api.receipt.models.Item
import com.receipt_api.receipt.models.Receipt
import io.vertx.core.json.JsonArray
import io.vertx.core.json.JsonObject
import io.vertx.kotlin.core.json.get
import java.math.BigDecimal
import java.math.RoundingMode
import java.time.LocalDate

object ReceiptProcessor {

  // processes a receipt object and accrues any/all points for it
  fun processReceipt(receipt: Receipt): Int {
    var points = 0

    // One point for every alphanumeric character in the retailer name.
    receipt.points += countAlphanumericCharacters(receipt.retailer)

    // 50 points if the total is a round dollar amount with no cents.
    if (receipt.total.rem(BigDecimal(1)).compareTo(BigDecimal.ZERO) == 0) {
      receipt.points += 50
    }

    // 25 points if the total is a multiple of 0.25.
    if (receipt.total.rem(BigDecimal(0.25)).compareTo(BigDecimal.ZERO) == 0) {
      receipt.points += 25
    }

    // 5 points for every two items on the receipt.
    receipt.points += 5 * (receipt.items.size / 2)

    // If the trimmed length of the item description is a multiple of 3, multiply the price by 0.2 and round up to the nearest integer. The result is the number of points earned.
    receipt.points += countItemDescriptionLength(receipt.items)

    // 6 points if the day in the purchase date is odd.
    val purchaseDate = LocalDate.parse(receipt.purchaseDate)
    if (purchaseDate.dayOfMonth % 3 == 0 || purchaseDate.dayOfMonth == 1) {
      receipt.points += 6
    }

    // 10 points if the time of purchase is after 2:00pm and before 4:00pm.
    val purchaseHour = receipt.purchaseTime.substring(0, 2).toInt()
    receipt.points += determinePurchaseTime(purchaseHour)

    return receipt.points
  }

  // parse POST JSON body to create a Receipt object
  // this also verifies the data sent in the POST requests body
  fun fromJson(body: JsonObject): Receipt {
    val receipt = Receipt(
      retailer = body["retailer"] ?: throw Error("missing required attribute", Throwable("retailer")),
      purchaseDate = body["purchaseDate"] ?: throw Error("missing required attribute", Throwable("purchaseDate")),
      purchaseTime = body["purchaseTime"] ?: throw Error("missing required attribute", Throwable("purchaseTime")),
    )

    val total: String? = body["total"]
    if (total != null) {
      receipt.total = BigDecimal(body.get<String>("total"))
    } else {
      throw Error("missing required attribute", Throwable("total"))
    }

    val items: JsonArray? = body["items"]
    if (items != null) {
      val itemsList: MutableList<Item> = mutableListOf()
      items.mapIndexed { index, _ ->
        val item = items.get<JsonObject>(index)
        itemsList.add(
          Item(
            shortDescription = item["shortDescription"],
            price = BigDecimal(item.get<String>("price"))
          )
        )
      }
      receipt.items = itemsList.toTypedArray()
    } else {
      throw Error("missing required attribute", Throwable("items"))
    }

    return receipt
  }

  /**
   * Private helper methods used in "ReceiptProcessor.processReceipt"
   */

  private fun countAlphanumericCharacters(name: String): Int {
    var count = 0
    name.forEach {
      if (it.isLetter()) count += 1
    }

    return count
  }

  private fun countItemDescriptionLength(items: Array<Item>): Int {
    var count = 0
    items.forEach { item ->
      val trimmedDescription = item.shortDescription.trim()
      if (trimmedDescription.length % 3 == 0) {
        count += (item.price * BigDecimal(0.2)).setScale(0, RoundingMode.CEILING).toInt()
      }
    }

    return count
  }

  private fun determinePurchaseTime(hour: Int): Int {
    var count = 0
    if (hour in 14..16) count = 10
    return count
  }
}
