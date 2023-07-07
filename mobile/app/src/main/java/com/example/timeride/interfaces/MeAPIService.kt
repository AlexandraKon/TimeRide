package com.example.timeride.interfaces


import com.example.timeride.dataClasses.UserResponse
import retrofit2.Call
import retrofit2.http.*

interface MeAPIService {


    //Get user id
    @GET("auth/me")
    suspend fun getUser(@Header("Authorization") authHeader: String): UserResponse

    @DELETE("users/{userId}")
    suspend fun deleteUser(
        @Header("Authorization") authHeader: String,
        @Path("userId") userId: Int
    ): Unit

    @PUT("users/{userId}")
    fun updateUser(
        @Header("Authorization") authHeader: String,
        @Path("userId") userId: Int,
        @Body userUpdate: UserUpdate
    ): Call<UpdateResponse>

    @POST("auth/forgot-password")
    fun forgotPassword(@Body email: RecoverMail): Call<RecoverResponse>

    @GET("users/{userId}")
    fun getUsernameById(
        @Header("Authorization") authHeader: String,
        @Path("userId") userId: Int
    ): Call<UserResponse>

    data class UserUpdate(
        val name: String,
        val profilePicture: String,
        val city: String,
        val occupation: String,
    )

    data class UpdateResponse(
        val status: Int,
        val message: String,
    )

    data class RecoverMail(
        val mail: String
    )

    data class RecoverResponse(
        val message: String,
        //val link: String?
    )
}