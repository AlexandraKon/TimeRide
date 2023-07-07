package com.example.timeride.fragments

import android.content.ContentValues
import android.content.ContentValues.TAG
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.*
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
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
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.GoogleAuthProvider
import kotlinx.coroutines.MainScope
import kotlinx.coroutines.launch
import org.json.JSONObject
import java.lang.Exception

class RegisterFragment : Fragment() {
    private lateinit var auth: FirebaseAuth
    private lateinit var googleSignInClient: GoogleSignInClient
    private val RC_SIGN_IN = 9001

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?

    ): View? {
        setHasOptionsMenu(true)
        // Inflate the layout for this fragment
        val view = inflater.inflate(R.layout.fragment_register, container, false)
        //hide bottomNavigationView
        (activity as MainActivity?)!!.findViewById<View>(R.id.bottom_navigation_view).visibility =
            View.GONE
        //hide action bar
        (activity as AppCompatActivity?)!!.supportActionBar!!.hide()

        //Hide drawerLayout
        val drawerLayout = requireActivity().findViewById<DrawerLayout>(R.id.container)
        drawerLayout.setDrawerLockMode(DrawerLayout.LOCK_MODE_LOCKED_CLOSED)

        val name = view.findViewById<EditText>(R.id.name)
        val mail = view.findViewById<EditText>(R.id.mail)
        val username = view.findViewById<EditText>(R.id.username)
        val password = view.findViewById<EditText>(R.id.password)
        val password2 = view.findViewById<EditText>(R.id.password2)
        val btn = view.findViewById<Button>(R.id.btnCreateAccount)
        val btngoogle = view.findViewById<SignInButton>(R.id.btnGoogle)
        // ----------------API inici sessió-----------------
        val url = "https://servidor-steve-jobs.vercel.app/api/auth/register"
        //--------------------------------------------------


        var confirmedPassword: String


        //button create account
        btn.setOnClickListener() {
            if (name.text.isNotEmpty() && mail.text.isNotEmpty() && username.text.isNotEmpty() && password.text.isNotEmpty() && password2.text.isNotEmpty()) {
                if (mail.text.toString().contains("@") && mail.text.toString().contains(".")) {
                    if (name.text.toString().length > 2) {
                        if (username.text.toString().length > 4) {
                            if (password.text.toString() == password2.text.toString()) {
                                if (password.text.toString().length > 7) {
                                    if (password.text.toString().matches(Regex(".*[A-Z].*"))) {
                                        if (password.text.toString().matches(Regex(".*[0-9].*"))) {
                                            if (password.text.toString()
                                                    .matches(Regex(".*[a-z].*"))
                                            ) {
                                                confirmedPassword = password.toString()
                                                val jsonObject = JSONObject()
                                                jsonObject.put("name", name.text.toString())
                                                jsonObject.put("username", username.text.toString())
                                                jsonObject.put("mail", mail.text.toString())
                                                jsonObject.put("password", password.text.toString())

                                                //------------Conexio API--------------------------
                                                val queue: RequestQueue =
                                                    Volley.newRequestQueue(context)
                                                val request = JsonObjectRequest(
                                                    Request.Method.POST, url, jsonObject,
                                                    { response ->
                                                        try {
                                                            val token =
                                                                response.get("token") //token authenticate user
                                                            Log.i("--->", "----token---->" + token)
                                                            Token.getInstance()
                                                                .setToken(token as String?)
                                                            DatabaseHelper(requireContext()).insertRegister(
                                                                username.text.toString(),
                                                                password.text.toString(),
                                                                token.toString()
                                                            )
                                                            if (token.toString().isNotEmpty()) {
                                                                openFragment(TrackRoute())
                                                                val sharedPreferences =
                                                                    context?.getSharedPreferences(
                                                                        "TIMERIDE",
                                                                        Context.MODE_PRIVATE
                                                                    )
                                                                sharedPreferences?.edit()
                                                                    ?.putString("token", token)
                                                                    ?.apply()
                                                                MainScope().launch {
                                                                    Log.i(
                                                                        "---------tokenregistre",
                                                                        token.toString()
                                                                    )
                                                                }
                                                            }

                                                            /*jsonObject.getString(username.toString())
                                                            val jsonArray = JSONArray(response)
                                                            for (i in 0 until jsonArray.length()){
                                                                val obj = JSONObject(jsonArray.getString(0))
                                                                val message = obj.get("body")
                                                                print(message.toString())
                                                                Log.i("------", message.toString())
                                                            }*/
                                                            Toast.makeText(
                                                                context,
                                                                R.string.usuari_creat_correctament,
                                                                Toast.LENGTH_SHORT
                                                            ).show()
                                                        } catch (e: Exception) {
                                                            e.printStackTrace()
                                                            Toast.makeText(
                                                                context,
                                                                "Error",
                                                                Toast.LENGTH_SHORT
                                                            ).show()
                                                        }
                                                    }) { error ->
                                                    Log.e("TAG", "RESPONSE IS $error")
                                                    Toast.makeText(
                                                        context,
                                                        getString(R.string.register_error),
                                                        Toast.LENGTH_SHORT
                                                    ).show()
                                                }
                                                queue.add(request)
                                                //--------------------------------------------------
                                            } else {
                                                val text = getString(R.string.lowercase)
                                                val duration = Toast.LENGTH_SHORT
                                                val toast = Toast.makeText(context, text, duration)
                                                toast.show()
                                                return@setOnClickListener
                                            }
                                        } else {
                                            val text = getString(R.string.number)
                                            val duration = Toast.LENGTH_SHORT
                                            val toast = Toast.makeText(context, text, duration)
                                            toast.show()
                                            return@setOnClickListener
                                        }
                                    } else {
                                        val text = getString(R.string.uppercase)
                                        val duration = Toast.LENGTH_SHORT
                                        val toast = Toast.makeText(context, text, duration)
                                        toast.show()
                                        return@setOnClickListener
                                    }
                                } else {
                                    val text = getString(R.string.characheters)
                                    val duration = Toast.LENGTH_SHORT
                                    val toast = Toast.makeText(context, text, duration)
                                    toast.show()
                                    return@setOnClickListener
                                }
                            } else {
                                val text = getString(R.string.passwords)
                                val duration = Toast.LENGTH_SHORT
                                val toast = Toast.makeText(context, text, duration)
                                toast.show()
                            }
                        } else {
                            val text = getString(R.string.registerUsername)
                            val duration = Toast.LENGTH_SHORT
                            val toast = Toast.makeText(context, text, duration)
                            toast.show()
                        }
                    } else {
                        val text = getString(R.string.registerName)
                        val duration = Toast.LENGTH_SHORT
                        val toast = Toast.makeText(context, text, duration)
                        toast.show()
                    }
                } else {
                    val text = getString(R.string.registerMail)
                    val duration = Toast.LENGTH_SHORT
                    val toast = Toast.makeText(context, text, duration)
                    toast.show()
                }
            } else {
                val text = getString(R.string.empty_fields)
                val duration = Toast.LENGTH_SHORT
                val toast = Toast.makeText(context, text, duration)
                toast.show()
            }
        }
        // Initialize Firebase Auth
        auth = FirebaseAuth.getInstance()

        // Configure Google Sign In
        val gso = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
            .requestIdToken(getString(R.string.default_web_client_id))
            .requestEmail()
            .build()
        // Build a GoogleSignInClient
        googleSignInClient = GoogleSignIn.getClient(requireActivity(), gso)

        btngoogle.setOnClickListener { signInWithGoogle() }

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
                Log.w(TAG, "Google sign in failed", e)
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
                    val user = auth.currentUser
                    //get the user email
                    val email = user?.email
                    val pass = user?.uid
                    val name = user?.displayName
                    val username = user?.displayName
                    user?.getIdToken(true)?.addOnCompleteListener { task ->
                        if (task.isSuccessful) {
                            val idToken = task.result?.token
                            Log.i("--->", "----token---->$idToken")
                            Token.getInstance().setToken(idToken) //Setter del token

                            // Send user information to your server using Volley
                            val jsonObject = JSONObject()
                            jsonObject.put("name", name)
                            jsonObject.put("username", username)
                            jsonObject.put("mail", email)
                            jsonObject.put("password", pass)
                            Log.i("VALUES", name.toString())
                            Log.i("VALUES", username.toString())
                            Log.i("VALUES", email.toString())
                            Log.i("VALUES", pass.toString())


                            val url = "https://servidor-steve-jobs.vercel.app/api/auth/register"
                            val queue: RequestQueue = Volley.newRequestQueue(context)
                            val request = JsonObjectRequest(
                                Request.Method.POST, url, jsonObject,
                                { response ->
                                    DatabaseHelper(requireContext()).insertRegister(
                                        username.toString(),
                                        pass.toString(),
                                        idToken.toString()
                                    )
                                    val token = response.get("token") //token authenticate user
                                    Log.i("--->", "----token---->$token")
                                    Token.getInstance().setToken(token as String?)
                                    //go to track route fragment
                                    val mainFragment = TrackRoute()
                                    openFragment(mainFragment)
                                    Toast.makeText(
                                        context,
                                        R.string.Account_created,
                                        Toast.LENGTH_LONG
                                    ).show()

                                },
                                { error ->
                                    Toast.makeText(context, error.toString(), Toast.LENGTH_SHORT)
                                        .show()
                                    Log.i("TAG", "RESPONSE IS $error")

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