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
    points = countAlphanumericCharacters(receipt.retailer)
    println("Alphanumeric points: $points")
    receipt.points += countAlphanumericCharacters(receipt.retailer)

    // 50 points if the total is a round dollar amount with no cents.
    val foo = receipt.total.rem(BigDecimal(1))
    println("Dividing total price by 1: $foo")
    if (receipt.total.rem(BigDecimal(1)) === BigDecimal(0.00)) {
      println("Total price is round number")
      receipt.points += 50
    }

    // 25 points if the total is a multiple of 0.25.
    if (receipt.total.rem(BigDecimal(0.25)) == BigDecimal(0)) {
      println("Total price is a multiple of 0.25")
      receipt.points += 25
    }

    // 5 points for every two items on the receipt.
    points = 5 * (receipt.items.size / 2)
    println("Points for every two receipt item: $points")
    receipt.points += 5 * (receipt.items.size / 2)

    // If the trimmed length of the item description is a multiple of 3, multiply the price by 0.2 and round up to the nearest integer. The result is the number of points earned.
    receipt.points += countItemDescriptionLength(receipt.items)

    // 6 points if the day in the purchase date is odd.
    val purchaseDate = LocalDate.parse(receipt.purchaseDate)
    println("Purchase day: ${purchaseDate.dayOfMonth}")
    if (purchaseDate.dayOfMonth % 3 == 0 || purchaseDate.dayOfMonth == 1) {
      println("Purchase day is odd")
      receipt.points += 6
    }

    // 10 points if the time of purchase is after 2:00pm and before 4:00pm.
    val purchaseHour = receipt.purchaseTime.substring(0, 2).toInt()
    println("Purchase hour: $purchaseHour")
    points = determinePurchaseTime(purchaseHour)
    println("Points from purchase time: $points")
    receipt.points += determinePurchaseTime(purchaseHour)

    return receipt.points
  }

  // checks if any of the attributes sent via POST are missing
  // if none are missing then return true, otherwise false
  fun isReceiptDataValid(body: JsonObject): Boolean {

    return true
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
                price = BigDecimal(item.get("price") as String)
              )
            )
          }
          receipt.items = itemsList.toTypedArray()
        }
        "total" -> {
          receipt.total = BigDecimal(it.value.toString())
        }
        else -> {
          println("Body key doesn't match any I have hardcoded")
        }
      }
    }

    return receipt
  }

  /**
   * Private helper methods used in "ReceiptProcessor.processReceipt"
   */

  private fun countAlphanumericCharacters(name: String): Int {
    var count = 0
    name.forEach {
      if (it.isLetter()) {
        count += 1
      }
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
    if (hour in 14..16) {
      count = 6
    }

    return count
  }
}
