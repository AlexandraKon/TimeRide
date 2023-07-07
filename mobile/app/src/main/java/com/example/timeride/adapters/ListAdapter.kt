package com.example.timeride.adapters

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.RecyclerView
import com.example.timeride.R
import com.example.timeride.dataClasses.Post
import com.example.timeride.fragments.PostDetails


class ListAdapter(
    private val items: ArrayList<Post>,
    val context: Context,
    private val fragment: Fragment
) : RecyclerView.Adapter<ListAdapter.ViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_list, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val item: Post = items[position]
        holder.titlePost.text = item.title
        holder.usernamePost.text = item.username
        holder.descriptionPost.text = item.text


        holder.itemView.setOnClickListener {
            val postDetails = PostDetails.newInstance(item)
            val transaction = fragment.requireActivity().supportFragmentManager.beginTransaction()
            transaction.replace(R.id.frameLayout, postDetails)
            transaction.addToBackStack(null)
            transaction.commit()
        }


    }

    override fun getItemCount(): Int {
        return items.size
    }

    class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val titlePost = view.findViewById<TextView>(R.id.titlePost)
        val usernamePost = view.findViewById<TextView>(R.id.usernamePost)
        val descriptionPost = view.findViewById<TextView>(R.id.descriptionPost)
    }
}