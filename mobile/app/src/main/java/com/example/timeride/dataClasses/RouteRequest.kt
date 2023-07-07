package com.example.timeride.dataClasses

import com.google.gson.annotations.SerializedName

data class RouteRequest(
    @SerializedName("title") var title: String,
    @SerializedName("segons") var segons: Int,
    @SerializedName("modalitat") var modalitat: Int,
    @SerializedName("locations") var locations: List<Location>
)