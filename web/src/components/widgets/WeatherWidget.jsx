import { useEffect, useState } from "react";
import {
  Typography,
  useTheme,
  IconButton,
  InputBase,
  CircularProgress,
  Slide,
  Box,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";

import FlexBetween from "../styles/FlexBetween";
import FlexCenter from "../styles/FlexCenter";
import WidgetWrapper from "./WidgetWrapper";

const AdvertWidget = () => {
  const { palette } = useTheme();
  const neutralLight = palette.neutral.light;
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const [cityName, setCityName] = useState("Barcelona");
  const [inputText, setInputText] = useState("");
  const [data, setData] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=189271b827844bff7388350c44848615&units=metric`
    )
      .then((res) => {
        if (res.status === 200) {
          error && setError(false);
          return res.json();
        } else {
          throw new Error("Something went wrong");
        }
      })
      .then((data) => {
        setData(data);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [cityName, error]);

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      setCityName(e.target.value);
      setInputText("");
    }
  };

  return (
    <WidgetWrapper>
      {!loading ? (
        <>
          <FlexBetween
            backgroundColor={neutralLight}
            borderRadius="9px"
            gap="3rem"
            padding="0.1rem 1.5rem"
          >
            <InputBase
              variant="filled"
              label="Search location"
              error={error}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Search city"
              // style={{ minWidth: '140px' }}
            />
            <IconButton>
              <Search />
            </IconButton>
          </FlexBetween>
          <Typography
            color={dark}
            variant="h5"
            fontWeight="500"
            fontSize="1.5rem"
            textAlign="center"
            marginTop="1rem"
          >
            {data.name}
          </Typography>
          <FlexCenter>
            <img
              src={`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
              alt="Weather"
            />
            <Typography color={medium}>{data.weather[0].main}</Typography>
          </FlexCenter>

          <Typography color={main} fontSize="1.2rem" textAlign="center">
            {data.main.temp.toFixed()} °C
          </Typography>
          <Slide direction="left" timeout={800} in={!loading}>
            <Box>
              <Box
                borderRadius="12px"
                backgroundColor="rgba(0, 0, 0, 0.60)"
                textAlign="center"
                padding="0.3rem 0.2rem"
                marginTop="15px"
              >
                <Typography color={medium}><FormattedMessage id="weather.humidity" defaultMessage="Humidity"/></Typography>
                <Typography color={medium} m="0.5rem 0">
                  {data.main.humidity.toFixed()}%
                </Typography>
              </Box>
              <Box
                borderRadius="12px"
                backgroundColor="rgba(0, 0, 0, 0.60)"
                textAlign="center"
                padding="0.3rem 0.2rem"
                marginTop="15px"
              >
                <Typography color={medium}><FormattedMessage id="weather.wind" defaultMessage="Wind"/></Typography>
                <Typography color={medium} m="0.5rem 0">
                  {data.wind.speed.toFixed()} km/h
                </Typography>
              </Box>
              <Box
                borderRadius="12px"
                backgroundColor="rgba(0, 0, 0, 0.60)"
                textAlign="center"
                padding="0.3rem 0.2rem"
                marginTop="15px"
              >
                <Typography color={medium}>
                <FormattedMessage id="weather.feels" defaultMessage="Feels Like" />
                 </Typography>
                <Typography color={medium} m="0.5rem 0">
                  {data.main.feels_like.toFixed()} °C
                </Typography>
              </Box>
            </Box>
          </Slide>
        </>
      ) : (
        <CircularProgress />
      )}
    </WidgetWrapper>
  );
};

export default AdvertWidget;
