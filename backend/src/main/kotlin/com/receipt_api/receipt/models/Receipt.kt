package com.receipt_api.receipt.models

data class Receipt(
  val id: String,
  val retailer: String,
  val purchaseDate: String,
  val purchaseTime: String,
  val items: Array<Item>, // may override a few methods for this later
  val total: String,
  val points: String
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

    json += "total: ${total}, points: ${points}}"

    return json
  }
}

data class Item(
  val shortDescription: String,
  val price: String
)
