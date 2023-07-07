package com.example.timeride.fragments

import android.annotation.SuppressLint
import android.content.ContentValues
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.*
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.drawerlayout.widget.DrawerLayout
import androidx.fragment.app.Fragment
import com.android.volley.Request
import com.android.volley.RequestQueue
import com.android.volley.toolbox.JsonObjectRequest
import com.android.volley.toolbox.Volley
import com.example.timeride.*
import com.example.timeride.dataClasses.Token
import com.example.timeride.mainActivity.MainActivity
import com.example.timeride.database.DatabaseHelper
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInAccount
import com.google.android.gms.auth.api.signin.GoogleSignInClient
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import com.google.android.gms.common.SignInButton
import com.google.android.gms.common.api.ApiException
import com.google.android.material.navigation.NavigationView
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.GoogleAuthProvider
import kotlinx.coroutines.MainScope
import kotlinx.coroutines.launch
import org.json.JSONObject
import java.lang.Exception


class MainFragment : Fragment() {
    private lateinit var auth: FirebaseAuth
    private lateinit var googleSignInClient: GoogleSignInClient
    private val RC_SIGN_IN = 9001
    private val url = "https://servidor-steve-jobs.vercel.app/api/auth/login"


    @SuppressLint("MissingInflatedId")
    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?

    ): View? {
        setHasOptionsMenu(true)
        // Inflate the layout for this fragment
        val view = inflater.inflate(R.layout.fragment_blank, container, false)
        val login = DatabaseHelper(requireContext()).getLogin()
        val registre = DatabaseHelper(requireContext()).getRegister()
        val token2 = registre?.third
        val token = login?.third

        val navigationView: NavigationView = requireActivity().findViewById(R.id.nav_view)
        val headerView = navigationView.getHeaderView(0)
        val navUsername: TextView = headerView.findViewById(R.id.user_name2)



        if (token != null || token2 != null) {
            openFragment(TrackRoute())
            //val username = login?.first ?: registre?.first
            //navUsername.text = username
        }


        //hide bottomNavigationView
        (activity as MainActivity?)!!.findViewById<View>(R.id.bottom_navigation_view).visibility =
            View.GONE
        //hide action bar
        (activity as AppCompatActivity?)!!.supportActionBar!!.hide()
        //Hide drawerLayout
        val drawerLayout = requireActivity().findViewById<DrawerLayout>(R.id.container)
        drawerLayout.setDrawerLockMode(DrawerLayout.LOCK_MODE_LOCKED_CLOSED)


        val button = view.findViewById<Button>(R.id.button)
        val username = view.findViewById<EditText>(R.id.username)
        val password = view.findViewById<EditText>(R.id.Password)
        val recover = view.findViewById<TextView>(R.id.recover)
        val register = view.findViewById<TextView>(R.id.register)
        val signInButton = view.findViewById<SignInButton>(R.id.sign_in_button)

        //when recover is clicked go to com.example.timeride.fragments.RecoverFragment
        recover.setOnClickListener {
            openFragment(RecoverFragment())
        }
        //when register is clicked go to RegisterFragment
        register.setOnClickListener {
            openFragment(RegisterFragment())
        }
        // Set up the sign in button click listener
        signInButton.setOnClickListener {
            val signInIntent = googleSignInClient.signInIntent
            requireActivity().startActivityForResult(signInIntent, 100)
        }
        button.setOnClickListener {

            if (username.text.isEmpty() || password.text.isEmpty()) {
                val text = "Has d'introduir usuari i contrasenya"
                val duration = Toast.LENGTH_SHORT
                val toast = Toast.makeText(requireContext(), text, duration)
                toast.show()
            } else if (username.text.toString() == "a" && password.text.toString() == "a") {
                Log.i("--->", "----token---->" + "admin")
            } else {
                val jsonObject = JSONObject()
                jsonObject.put("username", username.text.toString())
                jsonObject.put("password", password.text.toString())

                //send username to profile fragment
                val bundle = Bundle()
                bundle.putString("username", username.text.toString())
                val profileFragment = UserProfile()
                profileFragment.arguments = bundle


                //------------Conexio API--------------------------
                val queue: RequestQueue = Volley.newRequestQueue(context)
                val request = JsonObjectRequest(
                    Request.Method.POST, url, jsonObject,
                    { response ->
                        try {
                            val token = response.get("token") //token authenticate user
                            Log.i("--->", "----token---->" + token)
                            Token.getInstance().setToken(token as String?) //Setter del token
                            DatabaseHelper(requireContext()).insertLogin(
                                username.text.toString(),
                                password.text.toString(),
                                token.toString()
                            )
                            if (token.toString().isNotEmpty()) {
                                openFragment(TrackRoute())
                                val sharedPreferences =
                                    context?.getSharedPreferences("TIMERIDE", Context.MODE_PRIVATE)
                                sharedPreferences?.edit()?.putString("token", token)?.apply()
                                MainScope().launch {
                                    Log.i("---------tokenregistre", token.toString())
                                }
                            }
                        } catch (e: Exception) {
                            e.printStackTrace()
                            Toast.makeText(
                                context,
                                getString(R.string.Incorrect_login),
                                Toast.LENGTH_SHORT
                            ).show()

                        }
                    }) { error ->
                    // this method is called when we get
                    // any error while fetching data from our API
                    Log.e("TAG", "RESPONSE IS $error")
                    Toast.makeText(context, getString(R.string.Incorrect_login), Toast.LENGTH_SHORT)
                        .show()
                }
                queue.add(request)
                //--------------------------------------------------
            }
        }
        // Initialize Firebase Auth
        auth = FirebaseAuth.getInstance()

        // Configure Google Sign In
        val gso = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
            .requestIdToken(getString(R.string.default_web_client_id)) //default_web_client_id
            .requestEmail()
            .build()
        // Build a GoogleSignInClient
        googleSignInClient = GoogleSignIn.getClient(requireActivity(), gso)

        signInButton.setOnClickListener { signInWithGoogle() }

        return view
    }

    private fun signInWithGoogle() {
        val signInIntent = googleSignInClient.signInIntent
        startActivityForResult(signInIntent, RC_SIGN_IN)
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        // Result returned from launching the Intent from GoogleSignInApi.getSignInIntent(...);
        if (requestCode == RC_SIGN_IN) {
            val task = GoogleSignIn.getSignedInAccountFromIntent(data)
            try {
                // Google Sign In was successful, authenticate with Firebase
                val account = task.getResult(ApiException::class.java)
                firebaseAuthWithGoogle(account!!)
            } catch (e: ApiException) {
                // Google Sign In failed, update UI appropriately
                Toast.makeText(context, "Google sign in failed", Toast.LENGTH_LONG).show()
                Log.w(ContentValues.TAG, "Google sign in failed", e)
            }
        }
    }

    private fun firebaseAuthWithGoogle(acct: GoogleSignInAccount) {
        Log.d(ContentValues.TAG, "firebaseAuthWithGoogle:" + acct.id!!)

        val credential = GoogleAuthProvider.getCredential(acct.idToken, null)
        auth.signInWithCredential(credential)
            .addOnCompleteListener { task ->
                if (task.isSuccessful) {
                    // Sign in success, update UI with the signed-in user's information
                    Log.d(ContentValues.TAG, "signInWithCredential:success")
                    val user = auth.currentUser
                    //get the user email
                    val pass = user?.uid
                    val username = user?.displayName
                    user?.getIdToken(true)?.addOnCompleteListener { task ->
                        if (task.isSuccessful) {
                            val idToken = task.result?.token
                            Log.i("--->", "----token---->$idToken")
                            Token.getInstance().setToken(idToken) //Setter del token

                            // Send user information to your server using Volley
                            val jsonObject = JSONObject()
                            jsonObject.put("username", username)
                            jsonObject.put("password", pass)


                            //------------Conexio API--------------------------
                            val url = "https://servidor-steve-jobs.vercel.app/api/auth/login"
                            val queue: RequestQueue = Volley.newRequestQueue(context)
                            val request = JsonObjectRequest(
                                Request.Method.POST, url, jsonObject,
                                { response ->
                                    val token = response.get("token") //token authenticate user
                                    Log.i("--->", "----token---->" + token)
                                    Token.getInstance()
                                        .setToken(token as String?) //Setter del token
                                    DatabaseHelper(requireContext()).insertLogin(
                                        username.toString(),
                                        pass.toString(),
                                        token.toString()
                                    )
                                    if (token.toString().isNotEmpty()) {
                                        openFragment(TrackRoute())
                                        val sharedPreferences =
                                            context?.getSharedPreferences(
                                                "TIMERIDE",
                                                Context.MODE_PRIVATE
                                            )
                                        sharedPreferences?.edit()?.putString("token", token)
                                            ?.apply()
                                    }

                                },
                                { error ->
                                    Toast.makeText(context, error.toString(), Toast.LENGTH_SHORT)
                                        .show()
                                    Log.e("TAG", "RESPONSE IS $error")

                                })
                            queue.add(request)


                        } else {
                            Log.i("--->", "----token---->" + "error")
                        }
                    }

                } else {
                    // If sign in fails, display a message to the user.
                    Log.w(ContentValues.TAG, "signInWithCredential:failure", task.exception)
                    Toast.makeText(context, R.string.Authentication_failed, Toast.LENGTH_SHORT)
                        .show()
                }
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