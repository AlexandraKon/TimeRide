package com.example.timeride.dataClasses

import com.example.timeride.dataClasses.Post

data class PostResponse(
    val status: Int,
    val message: String,
    val result: List<Post>
)

