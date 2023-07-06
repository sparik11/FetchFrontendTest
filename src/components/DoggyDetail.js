import React from "react";
import {
  Card,
  Modal,
  Typography,
  CardContent,
  CardMedia,
  Box,
  IconButton,
} from "@mui/material";
import PinDropIcon from "@mui/icons-material/PinDrop";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";

const Dog = (props) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 450,
    bgcolor: "#fff",
    boxShadow: 25,
  };

  return (
    <Modal open={props.open} onClose={props.handleClose}>
      <Card sx={style}>
        <CardMedia
          component="img"
          image={props.dogMatch?.img || ""}
          alt={'Picture of a ${props.dogMatch?.breed} named ${props.dogMatch?.name}'}
          sx={{ height: 350 }}
        />
        <CardContent>
          <Typography variant="h4" component="div" id="modal-title" gutterBottom>
            {props.dogMatch?.name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {props.dogMatch?.breed}
          </Typography>
          <Box
            display="flex"
            alignItems="center"
            color="text.secondary"
            marginBottom={1}
          >
            <PermContactCalendarIcon fontSize="small" />
            <Typography variant="body2">
              <b>{props.dogMatch?.age}</b> year(s) old
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" color="text.secondary">
            <PinDropIcon fontSize="small" />
            <Typography variant="body2">
              I live in
              <b>
                {props.dogMatch?.city}, {props.dogMatch?.state}
              </b>
            </Typography>
          </Box>
          <Box marginTop={2}>
            <Typography variant="subtitle1" gutterBottom>
              Thank you for picking me.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Modal>
  );
};

export default Dog;