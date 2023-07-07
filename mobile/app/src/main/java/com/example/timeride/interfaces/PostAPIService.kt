package com.example.timeride.interfaces

import com.example.timeride.dataClasses.Post
import com.example.timeride.dataClasses.PostRequest
import com.example.timeride.dataClasses.PostResult
import retrofit2.http.*

interface PostAPIService {
    @GET("posts")
    fun getAllPosts(@Header("Authorization") token: String): retrofit2.Call<PostResult>

    @POST("posts")
    fun createPost(
        @Header("Authorization") token: String,
        @Body post: PostRequest
    ): retrofit2.Call<Post>

    @GET("posts/{userId}/posts")
    suspend fun getPosts(
        @Header("Authorization") authHeader: String,
        @Path("userId") userId: Int
    ): List<Post>
}