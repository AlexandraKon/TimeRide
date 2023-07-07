package com.example.timeride.interfaces


import com.example.timeride.dataClasses.CommentRequest
import org.json.JSONObject
import retrofit2.Call
import retrofit2.http.*

interface CommentAPIService {

    @POST("comments/{id}")
    fun createNewComment(
        @Header("Authorization") token: String,
        @Body comment: CommentRequest,
        @Path("id") id: String
    ): Call<JSONObject>

}