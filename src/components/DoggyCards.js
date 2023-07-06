import React, { useEffect, useState } from "react";
import { axiosWithAuth } from "../utilities/axiosWithAuth";
import Dog from "./DoggyDetail";
import {
  Box,
  Button,
  Container,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Checkbox,
  Grid,
  Typography,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const DogContainer = (props) => {
  const [dogs, setDogs] = useState([]);
  const [dogSelect, setDogSelect] = useState([]);
  const [dogMatch, setDogMatch] = useState({});
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    const fetchDogDetails = async () => {
      try {
        const response = await axiosWithAuth().post("/dogs", props.dogResults.resultIds);
        const updatedDogs = await getCities(response.data);
        setDogs(updatedDogs);
      } catch (error) {
        console.log({ error });
      }
    };

    fetchDogDetails();
  }, [props.dogResults]);

  const getCities = async (dogs) => {
    const uniqueZips = [...new Set(dogs.map((item) => item.zip_code))];

    try {
      const response = await axiosWithAuth().post("/locations", uniqueZips);
      const locations = response.data;

      const updatedDogs = dogs.map((dog) => {
        const locationMatch = locations.find((loc) => loc.zip_code === dog.zip_code);
        dog.city = locationMatch ? locationMatch.city : "Zip Code";
        dog.state = locationMatch ? locationMatch.state : dog.zip_code;
        return dog;
      });

      return updatedDogs;
    } catch (error) {
      console.log({ error });
      return dogs;
    }
  };

  const onMatch = async () => {
    try {
      const response = await axiosWithAuth().post("/dogs/match", dogSelect);
      const matchId = response.data.match;

      const matchResponse = await axiosWithAuth().post("/dogs", [matchId]);
      const updatedMatch = await getCities(matchResponse.data);
      setDogMatch(updatedMatch[0]);

      handleOpen();
    } catch (error) {
      console.log({ error });
    }
  };

  const handleChange = (e) => {
    const selectedDogId = e.target.id;

    if (e.target.checked) {
      setDogSelect((prevDogSelect) => [...prevDogSelect, selectedDogId]);
    } else {
      setDogSelect((prevDogSelect) =>
        prevDogSelect.filter((id) => id !== selectedDogId)
      );
    }
  };

  return (
    <>
      <Box maxWidth>
        <Container maxWidth={false} sx={{ width: "90%" }}>
          <Button
            variant="outlined"
            color="warning"
            onClick={onMatch}
            disabled={dogSelect.length === 0}
            sx={{ my: "2%" }}
          >
            Match Me
          </Button>
          <Dog dogMatch={dogMatch} open={open} handleClose={handleClose} />
          <Grid
            container
            columns={15}
            spacing={3}
            direction="row"
            justifyContent="space-around"
            alignItems="stretch"
            sx={{ mb: "5%" }}
          >
            {dogs.map((dog) => (
              <Grid item xs={7.5} sm={7.5} md={5} lg={3} xl={3} key={dog.id}>
                <Card>
                  <CardMedia
                    component="img"
                    alt={dog.breed}
                    height="200"
                    image={dog.img}
                  />
                  <CardContent>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="div"
                      align="left"
                    >
                      {dog.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      align="left"
                    >
                      My name is <b>{dog.name}</b>! I'm a <b>{dog.age}</b>{" "}
                      year old <b>{dog.breed}</b>. I am from{" "}
                      <b>
                        {dog.city} {dog.state}
                      </b>
                      !
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Checkbox
                      id={dog.id}
                      onChange={handleChange}
                      checked={dogSelect.includes(dog.id)}
                      icon={<FavoriteBorderIcon />}
                      checkedIcon={<FavoriteIcon />}
                      color="warning"
                    />
                    <Typography variant="body2" color="text.secondary">
                      Love
                    </Typography>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default DogContainer;
