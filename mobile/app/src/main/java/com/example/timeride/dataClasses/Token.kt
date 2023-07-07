package com.example.timeride.dataClasses

class Token private constructor() {
    companion object {
        private var instance: Token? = null
        fun getInstance(): Token {
            if (instance == null) {
                instance = Token()
            }
            return instance as Token
        }
    }

    private var token: String? = null

    fun setToken(token: String?) {
        this.token = token
    }

    fun getToken(): String? {
        return token
    }
}