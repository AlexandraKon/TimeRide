package com.example.timeride.dataClasses

data class UserResponse(
    val idUsuari: Int,
    val username: String,
    val mail: String,
    val name: String?,
    val profilePicture: String?,
    val friends: Array<String>,
    val city: String?,
    val occupation: String?,
    val viewedProfile: String?,
    val admin: Int,
    val createdAt: String,
    val updatedAt: String,
)