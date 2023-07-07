package com.example.timeride.fragments

import android.content.Context
import android.graphics.Color
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import androidx.core.content.ContextCompat
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.timeride.adapters.ListAdapterComments
import com.example.timeride.R
import com.example.timeride.dataClasses.Comment
import com.example.timeride.dataClasses.CommentRequest
import com.example.timeride.dataClasses.Post
import com.example.timeride.interfaces.CommentAPIService
import com.example.timeride.interfaces.RouteAPIService
import com.google.android.gms.maps.CameraUpdateFactory
import com.google.android.gms.maps.MapView
import com.google.android.gms.maps.model.LatLng
import com.google.android.gms.maps.model.LatLngBounds
import com.google.android.gms.maps.model.PolylineOptions
import kotlinx.coroutines.*
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory


class PostDetails : Fragment() {
    private var isLiked = false
    private var post: Post? = null
    private lateinit var mapView: MapView
    private val items: ArrayList<Comment> = ArrayList()
    private lateinit var rvList: RecyclerView

    companion object {
        const val ARG_PARAM1 = "post"

        @JvmStatic
        fun newInstance(item: Post) =
            PostDetails().apply {
                arguments = Bundle().apply {
                    putSerializable(ARG_PARAM1, item)

                }
            }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        arguments?.let {
            post = it.getSerializable(ARG_PARAM1) as Post
        }
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {

        return inflater.inflate(R.layout.fragment_post_details, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        val likeButton = view.findViewById<ImageView>(R.id.likeHeart)
        val tittle = view.findViewById<TextView>(R.id.tittle)
        val numViews = view.findViewById<TextView>(R.id.numViews)
        val description = view.findViewById<TextView>(R.id.description)
        val routeTime = view.findViewById<TextView>(R.id.routeTime)
        val modality = view.findViewById<ImageView>(R.id.modality)
        val commentEditText = view.findViewById<TextView>(R.id.commentEditText)
        val commentButton = view.findViewById<TextView>(R.id.commentButton)
        val usernamePostDetails = view.findViewById<TextView>(R.id.usernamePostDetails)

        mapView = view.findViewById(R.id.mapView2)
        val LatLangs = mutableListOf<LatLng>()
        rvList = view.findViewById(R.id.comments_list)

        tittle?.text = post?.title
        numViews?.text = post?.viewCounts.toString()
        description?.text = post?.text
        usernamePostDetails?.text = post?.username

        // Retrieve the saved status of the like from the shared preference
        val sharedPreferences = requireContext().getSharedPreferences("LIKES", Context.MODE_PRIVATE)
        isLiked = sharedPreferences.getBoolean(post?._id.toString(), false)

        // Update the like button drawable based on the saved status of the like
        if (isLiked) {
            likeButton.setImageDrawable(
                ContextCompat.getDrawable(
                    requireContext(),
                    R.drawable.filled_heart
                )
            )
        } else {
            likeButton.setImageDrawable(
                ContextCompat.getDrawable(
                    requireContext(),
                    R.drawable.outlined_heart
                )
            )
        }
        likeButton.setOnClickListener {
            if (!isLiked) {
                likeButton.setImageDrawable(
                    ContextCompat.getDrawable(
                        requireContext(),
                        R.drawable.filled_heart
                    )
                )
                isLiked = true
                saveLikeStatus(true)
            } else {
                likeButton.setImageDrawable(
                    ContextCompat.getDrawable(
                        requireContext(),
                        R.drawable.outlined_heart
                    )
                )
                isLiked = false
                saveLikeStatus(false)
            }
        }


        mapView.onCreate(savedInstanceState)

        mapView.onResume()

        GlobalScope.launch {
            try {
                val sharedPreferences =
                    context?.getSharedPreferences("TIMERIDE", Context.MODE_PRIVATE)
                val token = sharedPreferences?.getString("token", null)
                val call = post?.route?.let {
                    getRetrofit().create(RouteAPIService::class.java)
                        .routeDetails("Bearer ${token.toString()}", it).execute()
                }
                val routeResult = call?.body()
                if (routeResult != null) {
                    MainScope().launch {
                        val totalSegons = routeResult.result.segons
                        val modalitat = routeResult.result.modalitat
                        val minutos = totalSegons / 60
                        val segundos = totalSegons % 60
                        routeTime.text = "$minutos minutos, $segundos segundos"
                        routeTime.text = "${minutos} min ${segundos} s"
                        when (modalitat) {
                            1 -> if (isAdded) modality.setImageDrawable(
                                ContextCompat.getDrawable(
                                    requireContext(),
                                    R.drawable.foot
                                )
                            )
                            2 -> if (isAdded) modality.setImageDrawable(
                                ContextCompat.getDrawable(
                                    requireContext(),
                                    R.drawable.car
                                )
                            )
                            3 -> if (isAdded) modality.setImageDrawable(
                                ContextCompat.getDrawable(
                                    requireContext(),
                                    R.drawable.moto
                                )
                            )
                        }


                    }
                }
                val locations = routeResult?.result?.locations
                Log.i("----------locations", locations.toString())
                val latLngs = locations?.map { location ->
                    LatLng(location.coordinates[0], location.coordinates[1])
                } ?: emptyList()

                LatLangs.addAll(latLngs)

                withContext(Dispatchers.Main) {
                    mapView.getMapAsync { googleMap ->
                        val polylineOptions = PolylineOptions().apply {
                            addAll(LatLangs)
                            width(10f)
                            color(Color.BLUE)
                        }

                        googleMap.addPolyline(polylineOptions)

                        if (LatLangs.isNotEmpty()) {
                            val builder = LatLngBounds.Builder()
                            LatLangs.forEach { builder.include(it) }
                            val bounds = builder.build()

                            googleMap.moveCamera(CameraUpdateFactory.newLatLngBounds(bounds, 50))
                        }
                    }
                }
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    Toast.makeText(context, "Ruta no disponible", Toast.LENGTH_SHORT).show()
                }
                e.printStackTrace()
            }
        }
        post?.comments?.forEach {
            items.add(it)
        }
        if (rvList != null) {
            rvList.adapter = ListAdapterComments(items, requireContext(), this)
            rvList.layoutManager = LinearLayoutManager(context)
        }

        commentButton.setOnClickListener {
            createComment(commentEditText.text.toString(), post?._id.toString())
            commentEditText.text = ""
            rvList.adapter?.notifyDataSetChanged()
        }
    }


    override fun onResume() {
        super.onResume()
        mapView.onResume()
    }

    override fun onPause() {
        super.onPause()
        mapView.onPause()
    }

    override fun onDestroy() {
        super.onDestroy()
        mapView.onDestroy()
    }

    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        mapView.onSaveInstanceState(outState)
    }

    private fun getRetrofit(): Retrofit {
        return Retrofit.Builder()
            .baseUrl("https://servidor-steve-jobs.vercel.app/api/")
            .addConverterFactory(GsonConverterFactory.create()).build()
    }

    @OptIn(DelicateCoroutinesApi::class)
    private fun createComment(comment: String, idPost: String) {
        try {
            GlobalScope.launch {
                val sharedPreferences =
                    context?.getSharedPreferences("TIMERIDE", Context.MODE_PRIVATE)
                val token = sharedPreferences?.getString("token", null)
                val call = getRetrofit().create(CommentAPIService::class.java)
                val commentRequest = CommentRequest(comment)
                val response =
                    call.createNewComment("Bearer $token", commentRequest, idPost).execute()
                MainScope().launch {
                    if (response.isSuccessful) {
                        // activity?.runOnUiThread {
                        post?.let { Comment(comment, it.user, null, null, null) }
                            ?.let { items.add(it) }
                        rvList.adapter?.notifyDataSetChanged()
                        //  }
                        Toast.makeText(context, "Comentari enviat correctament", Toast.LENGTH_SHORT)
                            .show()
                    } else {
                        Toast.makeText(
                            context,
                            "No s'ha pogut enviar el comentari",
                            Toast.LENGTH_SHORT
                        ).show()
                    }
                }
            }
        } catch (e: Exception) {
            Toast.makeText(context, "No s'ha pogut enviar el comentari", Toast.LENGTH_SHORT).show()
            e.printStackTrace()
        }
    }

    private fun saveLikeStatus(isLiked: Boolean) {
        val sharedPreferences = requireContext().getSharedPreferences("LIKES", Context.MODE_PRIVATE)
        val editor = sharedPreferences.edit()
        editor.putBoolean(post?._id.toString(), isLiked)
        editor.apply()
    }
}
