package com.example.timeride

import android.Manifest
import android.annotation.SuppressLint
import android.content.Context
import android.content.pm.PackageManager
import android.graphics.BitmapFactory
import android.graphics.Color
import android.location.Location
import android.location.LocationManager
import android.os.Bundle
import android.os.SystemClock
import android.util.Base64
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import android.view.*
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.fragment.app.Fragment
import com.google.android.gms.maps.GoogleMap
import com.google.android.gms.maps.MapView
import com.google.android.gms.maps.model.LatLng
import com.google.android.gms.maps.model.PolylineOptions
import android.widget.Chronometer
import androidx.core.content.ContextCompat
import androidx.drawerlayout.widget.DrawerLayout
import com.bumptech.glide.Glide
import com.example.timeride.mainActivity.MainActivity
import com.example.timeride.dataClasses.PostRequest
import com.example.timeride.dataClasses.RouteRequest
import com.example.timeride.database.DatabaseHelper
import com.example.timeride.interfaces.PostAPIService
import com.example.timeride.interfaces.RouteAPIService
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationServices
import com.google.android.gms.maps.CameraUpdateFactory
import com.google.android.material.bottomsheet.BottomSheetDialog
import com.google.android.material.navigation.NavigationView
import com.google.firebase.auth.FirebaseAuth
import kotlinx.coroutines.DelicateCoroutinesApi
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.MainScope
import kotlinx.coroutines.launch
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

private lateinit var mapView: MapView
private const val REQUEST_LOCATION_PERMISSIONS = 1

class TrackRoute : Fragment() {

    // MutableList to store the route(temporary)
    private val route = mutableListOf<LatLng>()

    // GoogleMap instance
    private lateinit var googleMap: GoogleMap
    private lateinit var locationManager: LocationManager
    private lateinit var fusedLocationClient: FusedLocationProviderClient
    private var byteArray: ByteArray? = null

    private var isCameraFollowingUser = true

    // GoogleMap.OnCameraIdleListener to track the user's location
    private val cameraIdleListener = GoogleMap.OnCameraIdleListener {
        // If the camera is not currently following the user, do not add the camera position to the route
        if (!isCameraFollowingUser) {
            return@OnCameraIdleListener
        }
        // Add the current camera position to the route and update the polyline
        val position = googleMap.cameraPosition.target
        route.add(position)
    }

    private lateinit var chronometer: Chronometer
    private var isPlay = false
    private var pauseOffset: Long = 0

    @SuppressLint("CutPasteId")
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        val view = inflater.inflate(R.layout.fragment_track_route, container, false)
        (activity as MainActivity?)!!.findViewById<View>(R.id.bottom_navigation_view).visibility =
            View.VISIBLE
        (activity as AppCompatActivity?)!!.supportActionBar!!.show()

        val drawerLayout = requireActivity().findViewById<DrawerLayout>(R.id.container)
        drawerLayout.setDrawerLockMode(DrawerLayout.LOCK_MODE_UNLOCKED)
        // Show the NavigationView
        val navigationView: NavigationView = requireActivity().findViewById(R.id.nav_view)
        navigationView.visibility = View.VISIBLE
        // Get a reference to the MapView and the start and stop buttons
        mapView = view.findViewById(R.id.map_view)
        val buttonStart = view.findViewById<Button>(R.id.button_start)
        val buttonStop = view.findViewById<Button>(R.id.button_stop)
        var time = view.findViewById<TextView>(R.id.time)
        val modFoot = view.findViewById<ImageButton>(R.id.foot)
        val modCar = view.findViewById<ImageButton>(R.id.car)
        val modMoto = view.findViewById<ImageButton>(R.id.moto)
        val pressedColor = ContextCompat.getColorStateList(requireContext(), R.color.green)
        val defaultColor = modFoot.backgroundTintList

        var modality = 0
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(requireActivity())
        locationManager =
            requireActivity().getSystemService(Context.LOCATION_SERVICE) as LocationManager
        //display user location on the map zoomed
        chronometer = view.findViewById<Chronometer>(R.id.time)
        buttonStop.visibility = View.GONE
        buttonStart.setOnClickListener {
            // Start tracking the route
            googleMap.setOnCameraIdleListener(cameraIdleListener)
            if (modality != 0) {
                if (!isPlay) {
                    chronometer.base = SystemClock.elapsedRealtime() - pauseOffset
                    chronometer.start()
                    buttonStop.visibility = View.VISIBLE
                    buttonStart.text = getString(R.string.Stop)
                    isPlay = true
                    // Create a new PolylineOptions object
                    val polylineOptions = PolylineOptions()
                    // Add all the points in the route to the polyline
                    polylineOptions.addAll(route)
                    // Set the color of the polyline to blue
                    polylineOptions.color(Color.BLUE)
                    // Add the polyline to the map
                    googleMap.addPolyline(polylineOptions)
                } else {
                    pauseOffset = SystemClock.elapsedRealtime() - chronometer.base
                    chronometer.base = SystemClock.elapsedRealtime()
                    chronometer.stop()
                    buttonStart.text = getString(R.string.Starrt)
                    buttonStop.visibility = View.GONE
                    isPlay = false
                    val bottomSheet = layoutInflater.inflate(R.layout.bottomsheetlayout, null)
                    val dialog = BottomSheetDialog(requireContext(), R.style.BottomSheetDialogTheme)
                    dialog.setContentView(bottomSheet)
                    dialog.show()
                    val cancelButton = bottomSheet.findViewById<Button>(R.id.cancel_button)
                    cancelButton.setOnClickListener {
                        dialog.dismiss()
                        pauseOffset = 0
                    }
                    val title = bottomSheet.findViewById<EditText>(R.id.title_edittext)
                    val description = bottomSheet.findViewById<EditText>(R.id.description_edittext)
                    val postButton = bottomSheet.findViewById<Button>(R.id.post_button)
                    postButton.setOnClickListener {
                        if (title.text.length < 31) {
                            if (description.text.length < 101) {
                                sendRouteToServer(
                                    title.text.toString(),
                                    (pauseOffset.toString().toInt() / 1000),
                                    modality,
                                    description.text.toString()
                                )
                                dialog.dismiss()
                                pauseOffset = 0
                            } else {
                                Toast.makeText(
                                    context,
                                    "Descripció max 100 caracters",
                                    Toast.LENGTH_SHORT
                                ).show()
                            }
                        } else {
                            Toast.makeText(context, "Titol max 30 caracters", Toast.LENGTH_SHORT)
                                .show()
                        }
                    }

                }
            } else {
                Toast.makeText(context, getString(R.string.selectModality), Toast.LENGTH_SHORT)
                    .show()
            }
        }
        buttonStop.setOnClickListener {
            // Stop tracking the route
            googleMap.setOnCameraIdleListener(null)
            if (isPlay) {
                chronometer.stop()
                pauseOffset = SystemClock.elapsedRealtime() - chronometer.base
                isPlay = false
                buttonStop.text = getString(R.string.Resum)
            } else {
                chronometer.base = SystemClock.elapsedRealtime() - pauseOffset
                chronometer.start()
                buttonStop.text = getString(R.string.Pause)
                isPlay = true

            }
        }
        modFoot.setOnClickListener {
            modality = 1
            modFoot.setBackgroundResource(R.drawable.button_border_selected)
            modCar.setBackgroundResource(R.drawable.button_border)
            modMoto.setBackgroundResource(R.drawable.button_border)
        }
        modCar.setOnClickListener {
            modality = 2
            modCar.setBackgroundResource(R.drawable.button_border_selected)
            modFoot.setBackgroundResource(R.drawable.button_border)
            modMoto.setBackgroundResource(R.drawable.button_border)
        }
        modMoto.setOnClickListener {
            modality = 3
            modMoto.setBackgroundResource(R.drawable.button_border_selected)
            modFoot.setBackgroundResource(R.drawable.button_border)
            modCar.setBackgroundResource(R.drawable.button_border)
        }
        // Set up the MapView
        mapView.onCreate(savedInstanceState)
        mapView.getMapAsync { map ->
            // Set up the Google Map
            googleMap = map
            // Check if we have the necessary   permissions to access the user's location
            if (activity?.let {
                    ActivityCompat.checkSelfPermission(
                        it,
                        Manifest.permission.ACCESS_FINE_LOCATION
                    )
                } == PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(
                    requireContext(),
                    Manifest.permission.ACCESS_COARSE_LOCATION
                ) == PackageManager.PERMISSION_GRANTED) {
                // Enable the "My Location" button on the map
                googleMap.isMyLocationEnabled = true
                // Set the map to track the user's location
                googleMap.setOnMyLocationChangeListener { location ->
                    location.let {
                        // Add the user's current location to the route and update the polyline
                        val latLng = LatLng(it.latitude, it.longitude)
                        route.add(latLng)


                        // Disable zoom controls and set the map type to hybrid
                        googleMap.uiSettings.isZoomControlsEnabled = false
                        googleMap.mapType = GoogleMap.MAP_TYPE_NORMAL

                        // Disable scrolling and dragging of the map
                        googleMap.uiSettings.isScrollGesturesEnabled = false
                        googleMap.uiSettings.isScrollGesturesEnabledDuringRotateOrZoom = false
                        googleMap.uiSettings.isRotateGesturesEnabled = false
                        googleMap.uiSettings.isTiltGesturesEnabled = false
                        googleMap.uiSettings.isZoomGesturesEnabled = false

                        // Move the camera to the user's location
                        val cameraUpdate = CameraUpdateFactory.newLatLngZoom(latLng, 18f)
                        googleMap.moveCamera(cameraUpdate)


                    }
                }

                // Enable the user's location on the map
                googleMap.isMyLocationEnabled = true
                //get user location
                val locationManager =
                    requireActivity().getSystemService(Context.LOCATION_SERVICE) as LocationManager
                val locationProvider = LocationManager.GPS_PROVIDER

                //zoom to user location
                val lastKnownLocation: Location? =
                    locationManager.getLastKnownLocation(locationProvider)
                if (lastKnownLocation != null) {
                    val currentLatLng =
                        LatLng(lastKnownLocation.latitude, lastKnownLocation.longitude)
                    googleMap.animateCamera(CameraUpdateFactory.newLatLngZoom(currentLatLng, 15f))
                }
                // Create a new PolylineOptions object
                val polylineOptions = PolylineOptions()
                // Add all the points in the route to the polyline
                polylineOptions.addAll(route)
                // Set the color of the polyline to blue
                polylineOptions.color(Color.BLUE)
                // Add the polyline to the map
                googleMap.addPolyline(polylineOptions)
            } else {
                // Request the necessary permissions
                activity?.let {
                    ActivityCompat.requestPermissions(
                        it,
                        arrayOf(
                            Manifest.permission.ACCESS_FINE_LOCATION,
                            Manifest.permission.ACCESS_COARSE_LOCATION
                        ),
                        REQUEST_LOCATION_PERMISSIONS
                    )
                }
            }

            // Set the map type to normal
            googleMap.mapType = GoogleMap.MAP_TYPE_NORMAL
        }
        return view
    }

    override fun onResume() {
        super.onResume()
        mapView.onResume()
    }

    override fun onPause() {
        super.onPause()
        mapView.onPause()
    }

    override fun onLowMemory() {
        super.onLowMemory()
        // Call MapView.onLowMemory() to release some memory
        mapView.onLowMemory()
    }

    @Deprecated("Deprecated in Java")
    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<String>,
        grantResults: IntArray
    ) {
        if (requestCode == REQUEST_LOCATION_PERMISSIONS) {
            if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                // Permission was granted, request location updates from the GPS provider
                if (ActivityCompat.checkSelfPermission(
                        requireContext(),
                        Manifest.permission.ACCESS_FINE_LOCATION
                    ) == PackageManager.PERMISSION_GRANTED
                ) {

                    googleMap.isMyLocationEnabled = true
                }
            } else {
                // Permission was denied, show a Toast
                Toast.makeText(requireContext(), "Permission denied", Toast.LENGTH_LONG).show()
            }

            // TODO: Consider calling
            //    ActivityCompat#requestPermissions
            return
        }
        googleMap.isMyLocationEnabled = true
    }

    @OptIn(DelicateCoroutinesApi::class)
    @SuppressLint("InflateParams")
    private fun sendRouteToServer(title: String, segons: Int, modality: Int, description: String) {
        try {
            GlobalScope.launch {
                //val token = Token.getInstance().getToken()
                val sharedPreferences =
                    context?.getSharedPreferences("TIMERIDE", Context.MODE_PRIVATE)
                val token = sharedPreferences?.getString("token", null)
                Log.i("Retrofit", "Token: $token")
                val call = getRetrofit().create(RouteAPIService::class.java)
                val coordinates = route.map { listOf(it.latitude, it.longitude) }
                val locations = mutableListOf<com.example.timeride.dataClasses.Location>()
                for (coordinate in coordinates) {
                    val location = com.example.timeride.dataClasses.Location("Point", coordinate)
                    locations.add(location)

                }
                val route = RouteRequest(title, segons, modality, locations)

                val response = call.createRoute("Bearer $token", route).execute()
                val bottomSheet = layoutInflater.inflate(R.layout.bottomsheetlayout, null)
                val tags = bottomSheet.findViewById<EditText>(R.id.tags_edittext)?.text.toString()
                    .split(" ")

                if (response.isSuccessful) {
                    val id = response.body()?.result?._id
                    if (id != null) {
                        sendPostToServer(title, description, id, tags)
                    }
                } else {
                    Log.i("Retrofit", "Error creant ruta: ${response.errorBody()?.string()}")
                }
            }
        } catch (e: Exception) {
            Toast.makeText(context, getString(R.string.No_Routes), Toast.LENGTH_SHORT).show()
            e.printStackTrace()
        }
    }

    private fun sendPostToServer(
        title: String,
        description: String,
        idRoute: String,
        tags: List<String>
    ) {
        try {
            GlobalScope.launch {
                val sharedPreferences =
                    context?.getSharedPreferences("TIMERIDE", Context.MODE_PRIVATE)
                val token = sharedPreferences?.getString("token", null)
                val call = getRetrofit().create(PostAPIService::class.java)
                val post = PostRequest(title, description, tags.toTypedArray(), idRoute)

                val response = call.createPost("Bearer $token", post).execute()

                if (response.isSuccessful) {
                    MainScope().launch {
                        val createdRoute = response.body()
                        Toast.makeText(
                            context,
                            getString(R.string.Route_Created),
                            Toast.LENGTH_SHORT
                        ).show()
                        Log.i("Retrofit", "Post publicat correctament: $createdRoute")
                    }
                } else {
                    MainScope().launch {
                        Log.i(
                            "Retrofit",
                            "Error publicant el post: ${response.errorBody()?.string()}"
                        )
                        Toast.makeText(context, "Error", Toast.LENGTH_SHORT).show()
                    }
                }
            }

        } catch (e: Exception) {
            Toast.makeText(context, getString(R.string.No_Routes), Toast.LENGTH_SHORT).show()
            e.printStackTrace()
        }
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        //Set the username in the navigation drawer
        val login = DatabaseHelper(requireContext()).getLogin()
        val registre = DatabaseHelper(requireContext()).getRegister()
        val navigationView: NavigationView = requireActivity().findViewById(R.id.nav_view)
        val headerView = navigationView.getHeaderView(0)
        val navUsername: TextView = headerView.findViewById(R.id.user_name2)
        val username = login?.first ?: registre?.first
        navUsername.text = username
        //Set the google profile picture in the navigation drawer
        val user = FirebaseAuth.getInstance().currentUser
        val profileImage = headerView.findViewById<ImageView>(R.id.profile_image)
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

        val sharedPreferences2 = context?.getSharedPreferences("TIMERIDE", Context.MODE_PRIVATE)
        val profilePictureString = sharedPreferences2?.getString("profile_picture", null)

        if (profilePictureString != null) {
            // Convert the saved String back to a ByteArray and display the image in the ImageView
            byteArray = Base64.decode(profilePictureString, Base64.DEFAULT)
            val bitmap = BitmapFactory.decodeByteArray(byteArray, 0, byteArray!!.size)
            profileImage.setImageBitmap(bitmap)
        }

    }

    private fun getRetrofit(): Retrofit {
        return Retrofit.Builder()
            .baseUrl("https://servidor-steve-jobs.vercel.app/api/")
            .addConverterFactory(GsonConverterFactory.create()).build()
    }
}