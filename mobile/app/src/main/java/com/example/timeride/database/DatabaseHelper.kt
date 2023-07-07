package com.example.timeride.database

import android.annotation.SuppressLint
import android.content.ContentValues
import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper

class DatabaseHelper(context: Context) :
    SQLiteOpenHelper(context, DATABASE_NAME, null, DATABASE_VERSION) {

    companion object {
        private const val DATABASE_NAME = "TIMERIDE"
        private const val DATABASE_VERSION = 1

        const val TABLE_LOGIN = "Usuari"
        private const val COLUMN_ID = "idUsuari"
        const val COLUMN_USERNAME = "username"
        const val COLUMN_PASSWORD = "password"
        const val COLUMN_EMAIL = "email"
        const val COLUMN_TOKEN = "token"
    }

    override fun onCreate(db: SQLiteDatabase?) {
        val createLoginTable = "CREATE TABLE $TABLE_LOGIN (" +
                "$COLUMN_ID INTEGER PRIMARY KEY AUTOINCREMENT," +
                "$COLUMN_USERNAME TEXT," +
                "$COLUMN_PASSWORD TEXT," +
                "$COLUMN_EMAIL TEXT," +
                "$COLUMN_TOKEN TEXT)"
        db?.execSQL(createLoginTable)
    }

    override fun onUpgrade(db: SQLiteDatabase?, oldVersion: Int, newVersion: Int) {
        db?.execSQL("DROP TABLE IF EXISTS $TABLE_LOGIN")
        onCreate(db)
    }

    fun insertLogin(username: String, password: String, token: String) {
        val values = ContentValues()
        values.put(COLUMN_USERNAME, username)
        values.put(COLUMN_PASSWORD, password)
        values.put(COLUMN_TOKEN, token)

        val db = writableDatabase
        db.delete(TABLE_LOGIN, null, null) // delete any existing login data
        db.insert(TABLE_LOGIN, null, values)
        db.close()
    }


    @SuppressLint("Range")
    fun getLogin(): Triple<String, String, String>? {
        val query = "SELECT * FROM $TABLE_LOGIN"
        val db = readableDatabase
        val cursor = db.rawQuery(query, null)
        var login: Triple<String, String, String>? = null

        if (cursor.moveToFirst()) {
            val username = cursor.getString(cursor.getColumnIndex(COLUMN_USERNAME))
            val password = cursor.getString(cursor.getColumnIndex(COLUMN_PASSWORD))
            val token = cursor.getString(cursor.getColumnIndex(COLUMN_TOKEN)) ?: ""

            login = Triple(username, password, token)
        }

        cursor.close()
        db.close()
        return login
    }


    fun deleteLogin() {
        val db = writableDatabase
        db.delete(TABLE_LOGIN, null, null)
        db.close()
    }

    fun insertRegister(username: String, password: String, token: String) {
        val values = ContentValues()
        values.put(COLUMN_USERNAME, username)
        values.put(COLUMN_PASSWORD, password)
        values.put(COLUMN_TOKEN, token)

        val db = writableDatabase
        db.delete(TABLE_LOGIN, null, null) // delete any existing login data
        db.insert(TABLE_LOGIN, null, values)
        db.close()
    }

    @SuppressLint("Range")
    fun getRegister(): Triple<String, String, String>? {
        val query = "SELECT * FROM $TABLE_LOGIN"
        val db = readableDatabase
        val cursor = db.rawQuery(query, null)
        var register: Triple<String, String, String>? = null

        if (cursor.moveToFirst()) {
            val username = cursor.getString(cursor.getColumnIndex(COLUMN_USERNAME))
            val password = cursor.getString(cursor.getColumnIndex(COLUMN_PASSWORD))
            val token = cursor.getString(cursor.getColumnIndex(COLUMN_TOKEN)) ?: ""
            register = Triple(username, password, token)
        }

        cursor.close()
        db.close()
        return register
    }

}
