package com.example.timeride.fragments

import android.annotation.SuppressLint
import android.content.Context
import android.os.Bundle
import android.util.Log
import android.util.TypedValue
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.SearchView
import android.widget.TextView
import android.widget.Toast
import com.android.volley.Request
import com.android.volley.toolbox.JsonObjectRequest
import com.android.volley.toolbox.Volley
import com.bumptech.glide.Glide
import com.example.timeride.R

class Weather : Fragment() {

    private lateinit var searchView: SearchView
    private lateinit var weatherText: TextView
    private lateinit var weatherImage: ImageView

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_weather, container, false)

        searchView = view.findViewById(R.id.searchView)
        weatherText = view.findViewById(R.id.temperatureText)
        weatherText.setTextSize(TypedValue.COMPLEX_UNIT_SP, 24f)

        weatherImage = view.findViewById(R.id.weatherImage)

        searchView.setOnQueryTextListener(object : SearchView.OnQueryTextListener {
            override fun onQueryTextSubmit(query: String?): Boolean {
                query?.let { searchForWeather(it) }
                return true
            }

            override fun onQueryTextChange(newText: String?): Boolean {
                weatherText.text = ""
                weatherImage.setImageResource(0)
                return true
            }
        })

        return view
    }

    @SuppressLint("StringFormatMatches")
    private fun searchForWeather(location: String) {
        val apiKey = "3c1d961b68b04498a6e151356232403"
        val url = "https://api.weatherapi.com/v1/current.json?key=$apiKey&q=$location&lang=${
            getLanguagePreference(requireContext())
        }"
        val request = JsonObjectRequest(
            Request.Method.GET, url, null,
            { response ->
                // Successful API call
                val weather = response.getJSONObject("current")
                val tempC = weather.getDouble("temp_c")
                val condition = weather.getJSONObject("condition").getString("text")
                val iconUrl = "https:${weather.getJSONObject("condition").getString("icon")}"

                // Update UI with weather information
                val weatherOutput = getString(R.string.weather_output, location, condition, tempC)
                weatherText.text = weatherOutput
                Glide.with(requireContext()).load(iconUrl).into(weatherImage)
            },
            { error ->
                // Error occurred during API call
                Toast.makeText(
                    requireContext(),
                    "Error retrieving weather information",
                    Toast.LENGTH_SHORT
                ).show()
                Log.e("WeatherFragment", "Error retrieving weather information", error)
            })
        Volley.newRequestQueue(requireContext()).add(request)
    }

    private fun getLanguagePreference(context: Context): String? {
        val sharedPref = context.getSharedPreferences("TIMERIDE", Context.MODE_PRIVATE)
        if (sharedPref.getString("Language", "en") == "ca") {
            return "es"
        } else {
            return sharedPref.getString("Language", "en")

        }
    }

}
