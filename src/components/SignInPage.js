import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { axiosWithAuth } from "../utilities/axiosWithAuth";
import {
  Button,
  Grid,
  TextField,
  Typography,
  Box,
  Card,
  CardContent,
  CardHeader,
} from "@mui/material";

const LoginForm = (props) => {
  const [login, setLogin] = useState({
    name: "",
    email: "",
    canSubmit: false,
  });

  const navigate = useNavigate();

  const handleChange = useCallback((event) => {
    const { id, value } = event.target;
    setLogin((prevState) => ({
      ...prevState,
      [id]: value,
      canSubmit: prevState.name !== "" && prevState.email !== "" && value !== "",
    }));
  }, []);

  const handleSubmit = useCallback(() => {
    axiosWithAuth()
      .post("/auth/login", { name: login.name, email: login.email })
      .then((res) => {
        if (res.status === 200) {
          props.setIsLoggedIn(true);
          navigate("/search");
        }
      })
      .catch((err) => console.log({ err }));
  }, [login.name, login.email, navigate, props]);

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{ mt: "10%", ml: 0, height: 600 }}
    >
      <Card
        sx={{
          width: "50%",
          borderRadius: "30px",
          borderColor: "black",
          bgcolor: "lightblue",
        }}
      >
        <CardHeader
          title={
            <Typography align="center" color="black" variant="h3">
              Shelter Dogs
            </Typography>
          }
        />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="name"
                label="Enter Your Name"
                onChange={handleChange}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                id="email"
                label="Enter Your Email"
                onChange={handleChange}
                variant="outlined"
                fullWidth
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }}>
            <Button
              disabled={!login.canSubmit}
              onClick={handleSubmit}
              variant="contained"
              color="warning"
              fullWidth
            >
              Sign In
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default LoginForm;