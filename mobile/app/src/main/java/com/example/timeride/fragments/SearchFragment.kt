package com.example.timeride.fragments


import android.annotation.SuppressLint
import android.content.Context
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.SearchView
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.timeride.*
import com.example.timeride.adapters.ListAdapter
import com.example.timeride.dataClasses.Post
import com.example.timeride.dataClasses.PostResult
import com.example.timeride.dataClasses.Token
import com.example.timeride.interfaces.PostAPIService
import kotlinx.coroutines.DelicateCoroutinesApi
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.MainScope
import kotlinx.coroutines.launch
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

class SearchFragment : Fragment() {
    private val items: ArrayList<Post> = ArrayList()
    private lateinit var rvList: RecyclerView

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_search, container, false)

    }

    @OptIn(DelicateCoroutinesApi::class)
    @SuppressLint("NotifyDataSetChanged")
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        rvList = view.findViewById(R.id.rv_list)

        val searchView = view.findViewById<SearchView>(R.id.searchView)
        searchView?.setOnQueryTextListener(object : SearchView.OnQueryTextListener {
            override fun onQueryTextSubmit(query: String): Boolean {
                filter(query)
                return false
            }

            override fun onQueryTextChange(newText: String): Boolean {
                filter(newText)
                return false
            }
        })
        try {
            GlobalScope.launch {

                val sharedPreferences =
                    context?.getSharedPreferences("TIMERIDE", Context.MODE_PRIVATE)
                var token = sharedPreferences?.getString("token", null)
                if (token.isNullOrBlank()) {
                    token = Token.getInstance().getToken().toString()
                }
                Log.i("--token--", token.toString())

                val call = getRetrofit().create(PostAPIService::class.java)
                    .getAllPosts("Bearer ${token.toString()}").execute()
                //val postResult = call.body() as PostResult
                val postResult = call.body()?.let { it as PostResult }

                if (items.isEmpty()) {
                    var count = 0
                    if (postResult != null) {
                        postResult.result.reversed().forEach {
                            if (it.route != null && count < 30) {
                                items.add(
                                    Post(
                                        it._id,
                                        it.title,
                                        it.text,
                                        it.tags,
                                        it.viewCounts,
                                        it.user,
                                        it.username,
                                        it.profilePicture,
                                        it.route,
                                        it.comments,
                                        it.createdAt,
                                        it.updatedAt,
                                        it.__v
                                    )
                                )
                                count++
                            }
                        }
                    }
                }
                MainScope().launch {
                    Log.i("--token--", token.toString()) // moved inside the coroutine block
                    rvList.adapter?.notifyDataSetChanged()
                }
            }
        } catch (e: Exception) {
            Toast.makeText(context, "No posts disponibles", Toast.LENGTH_SHORT).show()
            e.printStackTrace()
        }
        Log.i("---->", items.toString())
        rvList.adapter = ListAdapter(items, requireContext(), this)
        rvList.layoutManager = LinearLayoutManager(context)
    }

    private fun getRetrofit(): Retrofit {
        return Retrofit.Builder()

            .baseUrl("https://servidor-steve-jobs.vercel.app/api/")
            .addConverterFactory(GsonConverterFactory.create()).build()
    }

    //Function to filter posts by the title of the post
    private fun filter(text: String) {
        val filteredList: ArrayList<Post> = ArrayList()
        for (item in items) {
            if (item.title.lowercase().contains(text.lowercase())) {
                filteredList.add(item)
            }
        }

        rvList.adapter = ListAdapter(filteredList, requireContext(), this)

        val rvList = view?.findViewById<RecyclerView>(R.id.rv_list)
        if (rvList != null) {
            rvList.adapter = ListAdapter(filteredList, requireContext(), this)
            rvList.layoutManager = LinearLayoutManager(context)
        }

    }
}


