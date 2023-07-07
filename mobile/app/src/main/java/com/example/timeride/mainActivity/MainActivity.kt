package com.example.timeride.mainActivity

import android.annotation.SuppressLint
import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.content.Intent
import android.content.res.Configuration
import android.net.Uri
import android.os.Bundle
import android.view.*
import android.widget.*
import androidx.appcompat.app.ActionBarDrawerToggle
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.drawerlayout.widget.DrawerLayout
import androidx.fragment.app.Fragment
import com.bumptech.glide.Glide
import com.example.timeride.R
import com.example.timeride.TrackRoute
import com.example.timeride.database.DatabaseHelper
import com.example.timeride.fragments.*
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.google.android.material.navigation.NavigationView
import com.google.firebase.auth.FirebaseAuth
import java.util.*


class MainActivity : AppCompatActivity() {


    private lateinit var toogle: ActionBarDrawerToggle
    private lateinit var navView: NavigationView

    @SuppressLint("CutPasteId")
    override fun onCreate(savedInstanceState: Bundle?) {
        setTheme(R.style.AppTheme)
        super.onCreate(savedInstanceState)
        val sharedPref = getSharedPreferences("TIMERIDE", Context.MODE_PRIVATE)
        val savedLanguage = sharedPref.getString("Language", null)
        if (savedLanguage != null) {
            val newLocale = Locale(savedLanguage)
            val configuration = Configuration(resources.configuration)
            configuration.setLocale(newLocale)
            resources.updateConfiguration(configuration, resources.displayMetrics)
        }

        setContentView(R.layout.activity_main)
        val drawerLayout: DrawerLayout = findViewById(R.id.container)
        navView = findViewById(R.id.nav_view)
        toogle = ActionBarDrawerToggle(this, drawerLayout, R.string.open, R.string.close)

        drawerLayout.closeDrawers()

        drawerLayout.addDrawerListener(toogle)
        navView.bringToFront()

        toogle.syncState()

        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        toogle.isDrawerIndicatorEnabled = true


        val navigationView = findViewById<NavigationView>(R.id.nav_view)
        val headerView = navigationView.getHeaderView(0)
        val profileImage = headerView.findViewById<ImageView>(R.id.profile_image)
        // Load the user's profile picture using Glide library
        val user = FirebaseAuth.getInstance().currentUser

        if (user != null) {
            user.photoUrl?.let {
                Glide.with(this)
                    .load(it)
                    .circleCrop()
                    .into(profileImage)
            }
        } else {
            profileImage.setImageResource(R.drawable.ic_profile)
        }



        navView.setNavigationItemSelectedListener { item ->
            when (item.itemId) {
                R.id.nav_Account -> {
                    openFragment(EditProfile())
                }
                R.id.nav_Language -> {
                    val languages = arrayOf(
                        getString(R.string.Catalan),
                        getString(R.string.English),
                        getString(R.string.Spanish)
                    )
                    val builder = AlertDialog.Builder(this)
                    builder.setTitle(R.string.Chooselanguage)
                        .setItems(languages) { _, which ->

                            val newLocale = when (languages[which]) {
                                getString(R.string.Catalan) -> Locale("ca")
                                getString(R.string.English) -> Locale("en")
                                getString(R.string.Spanish) -> Locale("es")
                                else -> Locale.getDefault()
                            }

                            val configuration = Configuration(resources.configuration)
                            configuration.setLocale(newLocale)

                            // Update the app's resources with the updated configuration
                            resources.updateConfiguration(configuration, resources.displayMetrics)

                            saveLanguagePreference(newLocale.language)
                            val intent = intent
                            finish()
                            startActivity(intent)


                        }
                    builder.create().show()
                }
                R.id.nav_Notifications -> {
                    val items = arrayOf(
                        Pair(getString(R.string.Allow_Notifications), false)
                    )

                    val adapter = object : ArrayAdapter<Pair<String, Boolean>>(
                        this,
                        R.layout.list_item_notification,
                        items
                    ) {
                        @SuppressLint("ServiceCast")
                        override fun getView(
                            position: Int,
                            convertView: View?,
                            parent: ViewGroup
                        ): View {
                            val view = convertView ?: LayoutInflater.from(context)
                                .inflate(R.layout.list_item_notification, parent, false)
                            val item = getItem(position)
                            view.findViewById<TextView>(R.id.item_label).text = item?.first
                            val toggleButton = view.findViewById<Switch>(R.id.my_switch)

                            toggleButton.setOnCheckedChangeListener { _, isChecked ->
                                if (isChecked) {
                                    // The toggle is turned on, allow sending notifications
                                    val notificationManager =
                                        getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
                                    val channel = NotificationChannel(
                                        "Timeride",
                                        "Timeride",
                                        NotificationManager.IMPORTANCE_DEFAULT
                                    )
                                    channel.description = "Timeride"
                                    notificationManager.createNotificationChannel(channel)
                                } else {
                                    // The toggle is turned off, don't allow sending notifications
                                    val notificationManager =
                                        getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
                                    notificationManager.cancelAll()
                                }
                            }

                            return view
                        }
                    }

                    val builder = AlertDialog.Builder(this)
                    builder.setTitle(getString(R.string.ChooseNotifications))
                    builder.setAdapter(adapter, null)
                    builder.create().show()
                }
                R.id.nav_Log_Out -> {
                    val builder = AlertDialog.Builder(this)
                    builder.setTitle(getString(R.string.Log_Out))
                        .setMessage(getString(R.string.confirm_logout))
                        .setPositiveButton(getString(R.string.Yes)) { _, _ ->
                            // Clear the user token
                            val sharedPrefs = getSharedPreferences("TIMERIDE", Context.MODE_PRIVATE)
                            val editor = sharedPrefs.edit()
                            editor.clear()
                            editor.apply()
                            val user = FirebaseAuth.getInstance().currentUser
                            if (user != null) {
                                FirebaseAuth.getInstance().signOut()
                            }
                            // Redirect the user to the login page
                            DatabaseHelper(this).deleteLogin()
                            openFragment(MainFragment())
                            intent.flags =
                                Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                            startActivity(intent)
                        }
                        .setNegativeButton(R.string.No) { _, _ ->
                            // Do nothing
                        }
                    builder.create().show()
                }


                R.id.nav_About -> {
                    val inflater = LayoutInflater.from(this)
                    val listItemView = inflater.inflate(R.layout.list_item_social_media, null)

                    val myTextView = listItemView.findViewById<TextView>(R.id.tw)
                    myTextView.setOnClickListener {
                        val intent = Intent(Intent.ACTION_VIEW, Uri.parse("https://twitter.com"))
                        startActivity(intent)
                    }

                    val myTextView2 = listItemView.findViewById<TextView>(R.id.social_media_name)
                    myTextView2.setOnClickListener {
                        val intent =
                            Intent(Intent.ACTION_VIEW, Uri.parse("https://www.facebook.com"))
                        startActivity(intent)
                    }

                    val myTextView3 = listItemView.findViewById<TextView>(R.id.ig)
                    myTextView3.setOnClickListener {
                        val intent =
                            Intent(Intent.ACTION_VIEW, Uri.parse("https://www.instagram.com"))
                        startActivity(intent)
                    }

                    val builder = AlertDialog.Builder(this)
                    builder.setTitle(getString(R.string.OurSocialMedia))
                    builder.setView(listItemView)
                    builder.create().show()
                }
                R.id.nav_web -> {
                    val intent = Intent(Intent.ACTION_VIEW, Uri.parse("https://www.timeride.com"))
                    startActivity(intent)
                }
                R.id.nav_weather -> {
                    openFragment(Weather())
                }

            }

            drawerLayout.closeDrawers()
            true
        }

        val bottomNavigationView = findViewById<BottomNavigationView>(R.id.bottom_navigation_view)
        val mainFragment = MainFragment()
        openFragment(mainFragment)
        //Set Map icon selected by default
        bottomNavigationView.selectedItemId = R.id.nav_track_route
        bottomNavigationView.setOnNavigationItemSelectedListener { item ->
            when (item.itemId) {
                R.id.nav_track_route -> {
                    val trackRouteFragment = TrackRoute()
                    openFragment(trackRouteFragment)
                    return@setOnNavigationItemSelectedListener true
                }
                R.id.nav_search -> {
                    val searchFragment = SearchFragment()
                    openFragment(searchFragment)
                    return@setOnNavigationItemSelectedListener true
                }
                R.id.nav_profile -> {
                    val profileFragment = UserProfile()
                    openFragment(profileFragment)
                    return@setOnNavigationItemSelectedListener true
                }
            }
            false
        }
    }

    private fun openFragment(fragment: Fragment) {
        val transaction = supportFragmentManager.beginTransaction()
        transaction
            .replace(R.id.frameLayout, fragment)
            .addToBackStack(null)
            .commit()
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        if (toogle.onOptionsItemSelected(item)) {
            return true
        }
        return super.onOptionsItemSelected(item)
    }

    private fun saveLanguagePreference(language: String) {
        val sharedPref = getSharedPreferences("TIMERIDE", Context.MODE_PRIVATE)
        sharedPref.edit().putString("Language", language).apply()
    }

}

