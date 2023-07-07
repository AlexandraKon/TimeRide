package com.example.timeride.dataClasses

import com.example.timeride.dataClasses.Route
import com.google.gson.annotations.SerializedName

data class RouteResult(
    @SerializedName("status") var status: Int,
    @SerializedName("message") var message: String,
    @SerializedName("result") var result: Route
)