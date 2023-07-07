package com.example.timeride.adapters

import android.text.TextUtils
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.BaseAdapter
import android.widget.TextView
import androidx.fragment.app.Fragment
import com.example.timeride.R
import com.example.timeride.dataClasses.Post
import com.example.timeride.fragments.PostDetails

class PostsAdapter(private val posts: List<Post>, private val fragment: Fragment) :
    BaseAdapter() {

    override fun getCount() = posts.size

    override fun getItem(position: Int) = posts[position]

    override fun getItemId(position: Int) = position.toLong()

    override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {
        val view = convertView ?: LayoutInflater.from(parent?.context)
            .inflate(R.layout.post_item, parent, false)

        // Bind the post data to the views in the layout
        val post = getItem(position)
        view.findViewById<TextView>(R.id.post).apply {
            text = post.title
            maxLines = 2
            ellipsize = TextUtils.TruncateAt.END
        }
        view.findViewById<TextView>(R.id.description).apply {
            text = post.text
            maxLines = 4
            ellipsize = TextUtils.TruncateAt.END
        }

        // Set an OnClickListener on the item view
        view.setOnClickListener {
            val postDetails = PostDetails.newInstance(post)
            val transaction =
                fragment.requireActivity().supportFragmentManager.beginTransaction()
            transaction.replace(R.id.frameLayout, postDetails)
            transaction.addToBackStack(null)
            transaction.commit()
        }

        return view
    }
}

