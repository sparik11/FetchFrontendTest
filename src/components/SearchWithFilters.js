import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { axiosWithAuth } from "../utilities/axiosWithAuth";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import DogContainer from "./DoggyCards";
import Pagination from "./DogPagination";

const Search = () => {
  const navigate = useNavigate();
  const [breeds, setBreeds] = useState([]);
  const [breedsSelect, setBreedsSelect] = useState([]);
  const [dogResults, setDogResults] = useState({ resultIds: [], total: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [ageSelect, setAgeSelect] = useState({ ageMin: null, ageMax: null });
  const [sortBy, setSortBy] = useState();

  const ageList = useMemo(() => {
    let list = [];
    for (let i = 0; i <= 20; i++) {
      list.push(i.toString());
    }
    return list;
  }, []);

  const sortOptions = useMemo(
    () => [
      { title: "Name A-Z", sortBy: "name:asc" },
      { title: "Name Z-A", sortBy: "name:desc" },
      { title: "Youngest First", sortBy: "age:asc" },
      { title: "Oldest First", sortBy: "age:desc" },
      { title: "Breed A-Z", sortBy: "breed:asc" },
      { title: "Breed Z-A", sortBy: "breed:desc" },
    ],
    []
  );

  const viewResultsStart = useCallback(() => {
    return (currentPage - 1) * 25 + 1;
  }, [currentPage]);

  useEffect(() => {
    axiosWithAuth()
      .get(`/dogs/breeds`)
      .then((res) => {
        setBreeds(res.data);
      })
      .catch((err) => console.log({ err }));
  }, []);

  useEffect(() => {
    search(1);
    setCurrentPage(1);
  }, [breedsSelect, ageSelect, sortBy]);

  const handleBreedSelect = useCallback((event, value) => {
    setBreedsSelect(value);
  }, []);

  const handleMinAge = useCallback((event, value) => {
    setAgeSelect((prevState) => ({ ...prevState, ageMin: value }));
  }, []);

  const handleMaxAge = useCallback((event, value) => {
    setAgeSelect((prevState) => ({ ...prevState, ageMax: value }));
  }, []);

  const handleSort = useCallback((event) => {
    const selectedSortBy = sortOptions.find(
      (option) => option.title === event.target.innerText
    )?.sortBy;
    setSortBy(selectedSortBy);
  }, [sortOptions]);

  const search = useCallback(
    (pageNumber) => {
      let params = {
        breeds: breedsSelect,
        sort: sortBy,
        from: (pageNumber - 1) * 25,
      };
      if (ageSelect.ageMin !== null) {
        params["ageMin"] = ageSelect.ageMin;
      }
      if (ageSelect.ageMax !== null) {
        params["ageMax"] = ageSelect.ageMax;
      }

      axiosWithAuth()
        .get(`/dogs/search`, {
          params: params,
        })
        .then((res) => {
          setDogResults(res.data);
        })
        .catch((err) => console.log({ err }));
    },
    [ageSelect, breedsSelect, sortBy]
  );

  const onPageChange = useCallback(
    (pageNumber) => {
      search(pageNumber);
      setCurrentPage(pageNumber);
    },
    [search]
  );

  const onLogout = useCallback(() => {
    axiosWithAuth()
      .post(`/auth/logout`)
      .then((res) => {
        if (res.status === 200) {
          navigate("/");
        }
      })
      .catch((err) => console.log({ err }));
  }, [navigate]);

  return (
    <>
      <header>
        <Box maxWidth>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
            sx={{ my: "3%", mx: "5%" }}
          >
            <Typography variant="h2" color="yellow">
              Find your favorite Shelter Doggy
            </Typography>
            <Button
              variant="outlined"
              color="warning"
              onClick={onLogout}
              sx={{
                px: {
                  xs: "10%",
                  sm: "10%",
                  md: "5%",
                  lg: "3%",
                  xl: "3%",
                },
              }}
            >
              Logout
            </Button>
          </Stack>
        </Box>
      </header>

      <Grid
        container
        maxWidth
        columns={16}
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
        sx={{ my: "1%", mx: 0 }}
      >
        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>

          <Autocomplete
            id="tags-breeds"
            multiple
            limitTags={2}
            options={breeds}
            onChange={handleBreedSelect}
            defaultValue={breeds[87]}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Breed"
                placeholder="Type Breed ..."
                fullWidth
              />
            )}
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3} lg={2} xl={2}>
          <Autocomplete
            id="ageMin"
            options={ageList}
            onChange={handleMinAge}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Min Age"
                placeholder="Age"
                fullWidth
              />
            )}
          />
        </Grid>
        <Grid item xs={6} sm={6} md={3} lg={2} xl={2}>
          <Autocomplete
            id="ageMax"
            options={ageList}
            onChange={handleMaxAge}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Max Age"
                placeholder="Age"
                fullWidth
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
          <Autocomplete
            id="sortBy"
            disableClearable
            options={sortOptions}
            getOptionLabel={(option) => option.title}
            onChange={handleSort}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="SortBy"
                placeholder="Select"
                fullWidth
              />
            )}
          />
        </Grid>
      </Grid>

      <Grid
        container
        columns={12}
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
        sx={{ my: "1%", mx: 0 }}
      >
        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
          <Box
            bgcolor="lightpink"
            p={2}
            display="inline-flex"
            alignItems="center"
            borderRadius={1}
          >
            <Typography variant="subtitle2" color="black">
              Dog {viewResultsStart()} -{" "}
              {dogResults?.resultIds.length + viewResultsStart() - 1} of{" "}
              {dogResults?.total}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
          <Pagination
            total={dogResults.total}
            currentPage={currentPage}
            onPageChange={onPageChange}
          />
        </Grid>
      </Grid>

      <DogContainer dogResults={dogResults} setDogResults={setDogResults} />

      <footer>
        <Grid
          container
          columns={12}
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
          sx={{ my: "3%", mx: 0 }}
        >
          <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
            <Box
              bgcolor="lightpink"
              p={2}
              display="inline-flex"
              alignItems="center"
              borderRadius={1}
            >
              <Typography variant="subtitle2" color="black">
                Dog {viewResultsStart()} -{" "}
                {dogResults?.resultIds.length + viewResultsStart() - 1} of{" "}
                {dogResults?.total}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
            <Pagination
              total={dogResults.total}
              currentPage={currentPage}
              onPageChange={onPageChange}
            />
          </Grid>
        </Grid>
      </footer>
    </>
  );
};

export default Search;
