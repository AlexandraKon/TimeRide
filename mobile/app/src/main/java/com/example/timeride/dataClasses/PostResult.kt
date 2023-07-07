package com.example.timeride.dataClasses

import com.example.timeride.dataClasses.Post
import com.google.gson.annotations.SerializedName

data class PostResult(
    @SerializedName("status") var status: Int,
    @SerializedName("message") var message: String,
    @SerializedName("result") var result: List<Post>
)
