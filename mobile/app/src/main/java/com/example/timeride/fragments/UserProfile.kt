package com.example.timeride.fragments

import android.annotation.SuppressLint
import android.content.Context
import android.graphics.BitmapFactory
import android.os.Bundle
import android.util.Base64
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.GridView
import android.widget.ImageView
import android.widget.TextView
import androidx.fragment.app.Fragment
import com.bumptech.glide.Glide
import com.example.timeride.database.DatabaseHelper
import com.example.timeride.adapters.PostsAdapter
import com.example.timeride.R
import com.example.timeride.dataClasses.Token
import com.example.timeride.dataClasses.Post
import com.example.timeride.interfaces.MeAPIService
import com.example.timeride.interfaces.PostAPIService
import com.google.firebase.auth.FirebaseAuth
import kotlinx.coroutines.*
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory


class UserProfile : Fragment() {
    private var userId: Int? = null
    private var posts: List<Post>? = null
    private var byteArray: ByteArray? = null

    @SuppressLint("CutPasteId", "SetTextI18n")
    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        val view = inflater.inflate(R.layout.fragment_user_profile, container, false)
        val login = DatabaseHelper(requireContext()).getLogin()
        var username = login?.first
        val user_name = view.findViewById<TextView>(R.id.user_name)
        val photo = view.findViewById<ImageView>(R.id.profile_image)


        // get the current user's profile picture URL
        val user = FirebaseAuth.getInstance().currentUser
        val photoUrl = user?.photoUrl
        if (photoUrl != null) {
            Glide.with(this)
                .load(photoUrl)
                .into(photo)
        }
        val sharedPreferences2 = context?.getSharedPreferences("TIMERIDE", Context.MODE_PRIVATE)
        val profilePictureString = sharedPreferences2?.getString("profile_picture", null)

        if (profilePictureString != null) {
            // Convert the saved String back to a ByteArray and display the image in the ImageView
            byteArray = Base64.decode(profilePictureString, Base64.DEFAULT)
            val bitmap = BitmapFactory.decodeByteArray(byteArray, 0, byteArray!!.size)
            photo.setImageBitmap(bitmap)
        }


        if (username != null) {
            user_name.text = "@$username"
        }

        val retrofit = Retrofit.Builder()
            .baseUrl("https://servidor-steve-jobs.vercel.app/api/")
            .addConverterFactory(GsonConverterFactory.create())
            .build()

        val meService = retrofit.create(MeAPIService::class.java)
        val postService = retrofit.create(PostAPIService::class.java)

        val sharedPreferences = context?.getSharedPreferences("TIMERIDE", Context.MODE_PRIVATE)
        var authHeader = sharedPreferences?.getString("token", null)
        if (authHeader == null) {
            authHeader = Token.getInstance().getToken().toString()
            Log.i("-------tokenNull", authHeader.toString())
        }
        Log.i("-------token", authHeader.toString())


        GlobalScope.launch {
            val userResponse = authHeader.let { meService.getUser(it) }
            userId = userResponse.idUsuari
            Log.i("-------id", userId.toString())
            val postResponse = authHeader.let { postService.getPosts(it, userId!!) }
            Log.i("-------post", postResponse.toString())
            posts = postResponse
            MainScope().launch {
                val gridView = view.findViewById<GridView>(R.id.posts_grid)
                gridView.adapter = PostsAdapter(posts!!.reversed(), this@UserProfile)
                val nameTextView = view.findViewById<TextView>(R.id.name)
                nameTextView.text =
                    userResponse.name // Update the name TextView with the user's name
            }

        }


        return view
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        val edit_profile_button = view.findViewById<Button>(R.id.edit_profile_button)
        edit_profile_button.setOnClickListener {
            openFragment(EditProfile())
        }
    }

    private fun openFragment(fragment: Fragment) {
        val transaction = requireActivity().supportFragmentManager.beginTransaction()
        transaction
            .replace(R.id.frameLayout, fragment)
            .addToBackStack(null)
            .commit()
    }

}