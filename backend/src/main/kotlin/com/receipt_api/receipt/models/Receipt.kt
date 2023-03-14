package com.receipt_api.receipt.models

import java.util.UUID

data class Receipt(
  val id: String = UUID.randomUUID().toString(),
  var retailer: String = "",
  var purchaseDate: String = "",
  var purchaseTime: String = "",
  var items: Array<Item> = emptyArray(), // may override a few methods for this later
  var total: String = "",
  val points: Int = 0
) {
  fun toJson(): String {
    var json = "{ " +
      "id: ${id}, " +
      "retailer: ${retailer}, " +
      "purchaseDate: ${purchaseDate}, " +
      "purchaseTime: ${purchaseTime}, " +
      "items: ["

    for((index, item) in items.withIndex()) {
      json += if (index == items.size - 1) {
        "{ shortDescription: ${item.shortDescription}, price: ${item.price} }], "
      } else {
        "{ shortDescription: ${item.shortDescription}, price: ${item.price} }, "
      }
    }

    json += "total: ${total}}"
//    json += "total: ${total}, points: ${points}}"

    return json
  }
}

data class Item(
  val shortDescription: String,
  val price: String
)
