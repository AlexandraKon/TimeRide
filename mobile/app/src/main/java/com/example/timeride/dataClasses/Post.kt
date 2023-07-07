package com.example.timeride.dataClasses

import com.example.timeride.dataClasses.Comment
import com.google.gson.annotations.SerializedName
import java.io.Serializable


data class Post(
    @SerializedName("_id") var _id: String,
    @SerializedName("title") var title: String,
    @SerializedName("text") var text: String,
    @SerializedName("tags") var tags: Array<String>?,
    @SerializedName("viewCounts") var viewCounts: Int,
    @SerializedName("user") var user: Int,
    @SerializedName("username") var username: String,
    @SerializedName("profilePicture") var profilePicture: String?,
    @SerializedName("route") var route: String,
    @SerializedName("comments") var comments: Array<Comment>?,
    @SerializedName("createdAt") var createdAt: String,
    @SerializedName("updatedAt") var updatedAt: String,
    @SerializedName("__v") var __v: Int
) : Serializable