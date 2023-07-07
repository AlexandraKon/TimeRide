package com.example.timeride.dataClasses

import com.google.gson.annotations.SerializedName


data class Route(
    @SerializedName("_id") var _id: String,
    @SerializedName("title") var title: String,
    @SerializedName("segons") var segons: Int,
    @SerializedName("modalitat") var modalitat: Int,
    @SerializedName("locations") var locations: List<Location>,
    @SerializedName("createdAt") var createdAt: String,
    @SerializedName("updatedAt") var updatedAt: String,
    @SerializedName("__v") var __v: Int
)