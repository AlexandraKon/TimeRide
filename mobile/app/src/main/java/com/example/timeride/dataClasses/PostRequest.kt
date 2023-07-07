package com.example.timeride.dataClasses

import com.google.gson.annotations.SerializedName

data class PostRequest(
    @SerializedName("title") var title: String,
    @SerializedName("text") var text: String,
    @SerializedName("tags") var tags: Array<String>,
    @SerializedName("route") var route: String,


    )