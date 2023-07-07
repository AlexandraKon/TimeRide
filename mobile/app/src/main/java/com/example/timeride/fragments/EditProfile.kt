package com.example.timeride.fragments

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.os.Bundle
import android.util.Base64
import android.util.Log
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.EditText
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import com.example.timeride.*
import com.example.timeride.dataClasses.Token
import com.example.timeride.mainActivity.MainActivity
import com.example.timeride.database.DatabaseHelper
import com.example.timeride.interfaces.MeAPIService
import com.google.firebase.auth.FirebaseAuth
import kotlinx.coroutines.*
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.io.ByteArrayOutputStream


class EditProfile : Fragment() {

    // Define a constant integer value for the pick image request
    private val PICK_IMAGE_REQUEST = 1
    private var userId: Int? = null
    private var byteArray: ByteArray? = null


    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_edit_profile, container, false)
        val name = view.findViewById<EditText>(R.id.user)
        val photo = view.findViewById<ImageView>(R.id.photo)
        val city = view.findViewById<EditText>(R.id.city)
        val occupation = view.findViewById<EditText>(R.id.occupation)
        val sharedPreferences = context?.getSharedPreferences("TIMERIDE", Context.MODE_PRIVATE)
        val profilePictureString = sharedPreferences?.getString("profile_picture", null)

        if (profilePictureString != null) {
            // Convert the saved String back to a ByteArray and display the image in the ImageView
            byteArray = Base64.decode(profilePictureString, Base64.DEFAULT)
            val bitmap = BitmapFactory.decodeByteArray(byteArray, 0, byteArray!!.size)
            photo.setImageBitmap(bitmap)
        }

        val login = DatabaseHelper(requireContext()).getLogin()
        val username = login?.first

        GlobalScope.launch {
            val sharedPreferences = context?.getSharedPreferences("TIMERIDE", Context.MODE_PRIVATE)
            var token = sharedPreferences?.getString("token", null)
            if (token == null) {
                token = Token.getInstance().getToken().toString()
                Log.i("-------tokenNull", token.toString())
            }

            val retrofit = Retrofit.Builder()
                .baseUrl("https://servidor-steve-jobs.vercel.app/api/")
                .addConverterFactory(GsonConverterFactory.create())
                .build()
            val meService = retrofit.create(MeAPIService::class.java)
            val meResponse = meService.getUser("Bearer $token")
            withContext(Dispatchers.Main) {
                // Extract the mail from the MeResponse object
                val nameUser = meResponse.name
                Log.i(
                    "---------------profilePicture",
                    meResponse.profilePicture?.toByteArray().toString()
                )
                val profilePictureUser = meResponse.profilePicture?.toByteArray()
                val cityUser = meResponse.city
                val occupationUser = meResponse.occupation

                name.setText(nameUser)

                val bitmap = profilePictureUser?.let {
                    BitmapFactory.decodeByteArray(
                        profilePictureUser,
                        0,
                        it.size
                    )
                }
                if (bitmap != null) {
                    photo.setImageBitmap(bitmap)
                    val editor = sharedPreferences?.edit()
                    val profilePictureString =
                        Base64.encodeToString(profilePictureUser, Base64.DEFAULT)
                    editor?.putString("profile_picture", profilePictureString)
                    editor?.apply()
                }

                city.setText(cityUser)
                occupation.setText(occupationUser)

            }
        }

        return view
    }

    @OptIn(DelicateCoroutinesApi::class)
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        val changephoto = view.findViewById<TextView>(R.id.changephoto)
        changephoto.setOnClickListener {
            // Create an intent to pick an image from the local gallery
            val intent = Intent(Intent.ACTION_PICK)
            intent.type = "image/*"
            startActivityForResult(intent, PICK_IMAGE_REQUEST)
        }

        val deleteButton = view.findViewById<TextView>(R.id.DeleteAccount)
        deleteButton.setOnClickListener {

            val builder = AlertDialog.Builder(requireContext())
            builder.setTitle(getString(R.string.Delete))
                .setMessage(getString(R.string.delete_account_message))
                .setNegativeButton(R.string.No) { _, _ ->
                    // Do nothing
                }
                .setPositiveButton(getString(R.string.Yes)) { _, _ ->
                    GlobalScope.launch {
                        val sharedPreferences =
                            context?.getSharedPreferences("TIMERIDE", Context.MODE_PRIVATE)
                        var token = sharedPreferences?.getString("token", null)
                        if (token == null) {
                            token = Token.getInstance().getToken().toString()
                            Log.i("-------tokenNull", token.toString())
                        }
                        val retrofit = Retrofit.Builder()
                            .baseUrl("https://servidor-steve-jobs.vercel.app/api/")
                            .addConverterFactory(GsonConverterFactory.create())
                            .build()
                        val meService = retrofit.create(MeAPIService::class.java)
                        val meResponse = meService.getUser("Bearer $token")
                        withContext(Dispatchers.Main) {
                            // Extract the user ID from the MeResponse object
                            userId = meResponse.idUsuari
                        }

                        deleteUserBBDD(userId!!)
                    }
                }
            builder.create().show()
        }

        val saveButton = view.findViewById<Button>(R.id.saveProfileButton)
        val name = view.findViewById<EditText>(R.id.user)
        val city = view.findViewById<EditText>(R.id.city)
        val occupation = view.findViewById<EditText>(R.id.occupation)
        saveButton.setOnClickListener {
            GlobalScope.launch {
                val sharedPreferences =
                    context?.getSharedPreferences("TIMERIDE", Context.MODE_PRIVATE)
                val token = sharedPreferences?.getString("token", null)

                val retrofit = Retrofit.Builder()
                    .baseUrl("https://servidor-steve-jobs.vercel.app/api/")
                    .addConverterFactory(GsonConverterFactory.create())
                    .build()
                val meService = retrofit.create(MeAPIService::class.java)
                val meResponse = meService.getUser("Bearer $token")
                withContext(Dispatchers.Main) {
                    // Extract the user ID from the MeResponse object
                    userId = meResponse.idUsuari
                    if (name.text.isNotEmpty() && city.text.isNotEmpty() && occupation.text.isNotEmpty() && byteArray != null) {
                        //updateUser(userId!!, name.text.toString(), city.text.toString(), occupation.text.toString())
                        updateUser(
                            userId!!,
                            name.text.toString(),
                            city.text.toString(),
                            occupation.text.toString(),
                            null
                        )
                    } else {
                        Toast.makeText(
                            requireContext(),
                            getString(R.string.Invalid_data),
                            Toast.LENGTH_SHORT
                        ).show()
                    }
                }
            }
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)

        if (requestCode == PICK_IMAGE_REQUEST && resultCode == Activity.RESULT_OK && data != null && data.data != null) {
            val imageUri = data.data
            val photo = view?.findViewById<ImageView>(R.id.photo)

            // Convert the selected image to a ByteArray
            val inputStream = context?.contentResolver?.openInputStream(imageUri!!)
            val bitmap = BitmapFactory.decodeStream(inputStream)
            val outputStream = ByteArrayOutputStream()
            bitmap.compress(Bitmap.CompressFormat.PNG, 100, outputStream)
            byteArray = outputStream.toByteArray()

            // Save the ByteArray in SharedPreferences
            val sharedPreferences = context?.getSharedPreferences("TIMERIDE", Context.MODE_PRIVATE)
            val editor = sharedPreferences?.edit()
            editor?.putString("profile_picture", Base64.encodeToString(byteArray, Base64.DEFAULT))
            editor?.apply()

            // Display the selected image in the ImageView
            photo?.setImageBitmap(bitmap)
        }
    }


    private fun openFragment(fragment: Fragment) {
        val transaction = requireActivity().supportFragmentManager.beginTransaction()
        transaction
            .replace(R.id.frameLayout, fragment)
            .addToBackStack(null)
            .commit()
    }

    private fun deleteUserBBDD(idUser: Int) {
        try {
            GlobalScope.launch {
                val sharedPreferences =
                    context?.getSharedPreferences("TIMERIDE", Context.MODE_PRIVATE)
                val token = sharedPreferences?.getString("token", null)
                val call = getRetrofit().create(MeAPIService::class.java)
                val response = call.deleteUser("Bearer $token", idUser)
                MainScope().launch {
                    Toast.makeText(context, getString(R.string.Deleted_Profile), Toast.LENGTH_SHORT)
                        .show()

                    // Clear the user token
                    val sharedPrefs =
                        requireContext().getSharedPreferences("TIMERIDE", Context.MODE_PRIVATE)
                    val editor = sharedPrefs.edit()
                    editor.clear()
                    editor.apply()
                    val user = FirebaseAuth.getInstance().currentUser
                    if (user != null) {
                        FirebaseAuth.getInstance().signOut()
                    }
                    DatabaseHelper(requireContext()).deleteLogin()
                    openFragment(MainFragment())
                    val intent = Intent(requireContext(), MainActivity::class.java)
                    intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                    requireActivity().finish()
                    startActivity(intent)
                }
            }
        } catch (e: Exception) {
            Toast.makeText(context, getString(R.string.Error_Delete), Toast.LENGTH_SHORT).show()
            e.printStackTrace()
        }
    }

    private fun updateUser(
        idUser: Int,
        name: String,
        city: String,
        occupation: String,
        profilePicture: ByteArray?
    ) {
        try {
            GlobalScope.launch {
                val sharedPreferences =
                    context?.getSharedPreferences("TIMERIDE", Context.MODE_PRIVATE)
                var token = sharedPreferences?.getString("token", null)
                if (token.isNullOrBlank()) {
                    token = Token.getInstance().getToken().toString()
                }
                Log.i("----token", "------------------$token")
                val call = getRetrofit().create(MeAPIService::class.java)
                val userUpdate =
                    MeAPIService.UserUpdate(name, profilePicture.toString(), city, occupation)
                val response = call.updateUser("Bearer $token", idUser, userUpdate).execute()
                val editResult = response.body() as MeAPIService.UpdateResponse
                if (editResult.status == 200) {
                    withContext(Dispatchers.Main) {
                        if (response.isSuccessful) {
                            Toast.makeText(
                                context,
                                getString(R.string.Updated_Profile),
                                Toast.LENGTH_SHORT
                            ).show()
                            openFragment(MainFragment())
                        } else {
                            Toast.makeText(
                                context,
                                getString(R.string.Error_Update),
                                Toast.LENGTH_SHORT
                            ).show()
                        }
                    }
                }
            }
        } catch (e: Exception) {
            Toast.makeText(context, getString(R.string.Error_Update), Toast.LENGTH_SHORT).show()
            e.printStackTrace()
        }
    }


    private fun getRetrofit(): Retrofit {
        return Retrofit.Builder()
            .baseUrl("https://servidor-steve-jobs.vercel.app/api/")
            .addConverterFactory(GsonConverterFactory.create()).build()
    }

}