package com.example.timeride.adapters

import android.annotation.SuppressLint
import android.content.Context
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.RecyclerView
import com.example.timeride.R
import com.example.timeride.dataClasses.Token
import com.example.timeride.dataClasses.Comment
import com.example.timeride.dataClasses.UserResponse
import com.example.timeride.interfaces.MeAPIService
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.text.ParseException
import java.text.SimpleDateFormat
import java.util.*
import kotlin.collections.ArrayList


class ListAdapterComments(
    private val items: ArrayList<Comment>,
    val context: Context,
    private val fragment: Fragment
) : RecyclerView.Adapter<ListAdapterComments.ViewHolder>() {


    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.comment_list, parent, false)
        return ViewHolder(view)
    }

    @SuppressLint("SimpleDateFormat")
    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val item: Comment = items[position]
        GlobalScope.launch {
            val username = withContext(Dispatchers.IO) {
                getUsername(item.user)
            }
            holder.commentUser.text = username
        }
        val inputFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
        val outputFormat = SimpleDateFormat("dd-MM-yyyy HH:mm")

        try {
            if (item.createdAt != null) {
                val date: Date = inputFormat.parse(item.createdAt)
                val outputDate: String = outputFormat.format(date)
                holder.commentDate.text = outputDate
            } else {
                holder.commentDate.text = context.getString(R.string.now)
            }
        } catch (e: ParseException) {
            e.printStackTrace()
        }
        holder.commentText.text = item.text

    }

    override fun getItemCount(): Int {
        return items.size
    }

    class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val commentUser = view.findViewById<TextView>(R.id.commentUser)
        val commentText = view.findViewById<TextView>(R.id.commentText)
        val commentDate = view.findViewById<TextView>(R.id.commentDate)

    }

    private suspend fun getUsername(idUser: Int): String? {
        var username: String? = null
        try {
            val sharedPreferences = context?.getSharedPreferences("TIMERIDE", Context.MODE_PRIVATE)
            var token = sharedPreferences?.getString("token", null)
            if (token.isNullOrBlank()) {
                token = Token.getInstance().getToken().toString()
            }
            Log.i("--token--", token.toString())
            val call = getRetrofit().create(MeAPIService::class.java)
            val response = call.getUsernameById(token, idUser).execute()
            val user = response.body() as UserResponse
            Log.i("--user--", user.toString())
            if (response.isSuccessful) {
                username = user.username
            } else {
                Log.i("--error--", "Error")
            }
        } catch (e: Exception) {
            username = context.getString(R.string.deleted_user)
            Log.i("--error--", "Error")
            e.printStackTrace()
        }
        Log.i("--username--", username.toString())
        return username
    }


    private fun getRetrofit(): Retrofit {
        return Retrofit.Builder()
            .baseUrl("https://servidor-steve-jobs.vercel.app/api/")
            .addConverterFactory(GsonConverterFactory.create()).build()
    }

}