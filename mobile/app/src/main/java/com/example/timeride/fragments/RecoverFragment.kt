package com.example.timeride.fragments

import android.os.Bundle
import android.view.*
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.drawerlayout.widget.DrawerLayout
import androidx.fragment.app.Fragment
import com.example.timeride.mainActivity.MainActivity
import com.example.timeride.R
import com.example.timeride.interfaces.MeAPIService
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.MainScope
import kotlinx.coroutines.launch
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

class RecoverFragment : Fragment() {
    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        setHasOptionsMenu(true)
        // Inflate the layout for this fragment
        val view = inflater.inflate(R.layout.fragment_recover, container, false)
        (activity as MainActivity?)!!.findViewById<View>(R.id.bottom_navigation_view).visibility =
            View.GONE
        //hide action bar
        (activity as AppCompatActivity?)!!.supportActionBar!!.hide()

        //Hide drawerLayout
        val drawerLayout = requireActivity().findViewById<DrawerLayout>(R.id.container)
        drawerLayout.setDrawerLockMode(DrawerLayout.LOCK_MODE_LOCKED_CLOSED)

        val buttonReturn = view.findViewById<Button>(R.id.button3)
        val buttonMail = view.findViewById<Button>(R.id.button2)
        val mail = view.findViewById<EditText>(R.id.emailRecover)
        mail.setText(arguments?.getString("mail"))
        val crear = view.findViewById<TextView>(R.id.textView3)

        buttonReturn.setOnClickListener {
            activity?.onBackPressed()
        }

        // Botó enviar mail
        buttonMail.setOnClickListener {
            if (mail.text.isNotEmpty()) {
                updatePassword(mail.text.toString())
            } else {
                val text = R.string.Registered_email
                val duration = Toast.LENGTH_SHORT
                val toast = Toast.makeText(requireContext(), text, duration)
                toast.show()
            }
        }
        //when crear is clicked go to RegisterFragment
        crear.setOnClickListener {
            openFragment(RegisterFragment())
        }
        return view
    }

    private fun openFragment(fragment: Fragment) {
        val transaction = activity?.supportFragmentManager?.beginTransaction()
        transaction?.replace(R.id.frameLayout, fragment)?.addToBackStack(null)?.commit()
    }

    private fun getRetrofit(): Retrofit {
        return Retrofit.Builder()
            .baseUrl("https://servidor-steve-jobs.vercel.app/api/")
            .addConverterFactory(GsonConverterFactory.create()).build()
    }

    private fun updatePassword(mail: String) {
        try {
            GlobalScope.launch {
                val recoverMail = MeAPIService.RecoverMail(mail)
                val call = getRetrofit().create(MeAPIService::class.java)
                val response = call.forgotPassword(recoverMail).execute()
                MainScope().launch {
                    if (response.isSuccessful) {
                        val text = R.string.Recover_Password
                        val duration = Toast.LENGTH_SHORT
                        val toast = Toast.makeText(requireContext(), text, duration)
                        toast.show()
                        openFragment(MainFragment())
                    } else {
                        val text = R.string.email_not_registered
                        val duration = Toast.LENGTH_SHORT
                        val toast = Toast.makeText(requireContext(), text, duration)
                        toast.show()
                    }
                }
            }
        } catch (e: Exception) {
            Toast.makeText(context, "ERROR", Toast.LENGTH_SHORT).show()
            e.printStackTrace()
        }
    }
}
