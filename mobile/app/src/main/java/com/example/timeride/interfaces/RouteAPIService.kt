package com.example.timeride.interfaces

import com.example.timeride.dataClasses.RouteResult
import com.example.timeride.dataClasses.RouteRequest
import retrofit2.http.*

interface RouteAPIService {

    @GET("routes")
    fun viewRoutes(@Header("Authorization") token: String): retrofit2.Call<RouteResult>

    @POST("routes")
    fun createRoute(
        @Header("Authorization") token: String,
        @Body route: RouteRequest
    ): retrofit2.Call<RouteResult>

    @GET("routes/{id}")
    fun routeDetails(
        @Header("Authorization") token: String,
        @Path("id") id: String
    ): retrofit2.Call<RouteResult>
}