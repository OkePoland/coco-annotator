import React, { useState } from "react";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import { Button } from "@material-ui/core";

import { useStyles } from "./Auth.components";

interface Props {
  activeTab: number;
  index: number;
}

const TabPanel: React.FC<Props> = ({ activeTab, index }) => {
  const classes = useStyles();

  const [credentials, setCredentials] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");

  const fullName = credentials.fullName;
  const username = credentials.username;
  const password = credentials.password;
  const confirmPassword = credentials.confirmPassword;

  const isValidUsername = !!username && !/^[0-9a-zA-Z_.-]+$/.test(username);
  const isValidPassword = !!password && password.length < 5;
  const isValidConfirmedPassword =
    !!confirmPassword && confirmPassword !== password;

  const handleChange = (prop: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCredentials({ ...credentials, [prop]: event.target.value });
  };

  const register = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!username || isValidUsername) {
      setError("Username is invalid");
    } else if (!password || isValidPassword) {
      setError("Password is invalid");
    } else if (!confirmPassword || isValidConfirmedPassword) {
      setError(`Passwords don't match`);
    } else {
      setError("");
    }
  };

  const login = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!username || isValidUsername) {
      setError("Username is invalid");
    } else if (!password || isValidPassword) {
      setError("Password is invalid");
    } else {
      setError("");
    }
  };

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={activeTab !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
    >
      <form
        className={classes.form}
        noValidate
        onSubmit={index === 1 ? register : login}
      >
        {index === 1 && (
          <TextField
            InputLabelProps={{ classes: { root: classes.label } }}
            variant="outlined"
            value={fullName}
            margin="normal"
            fullWidth
            id="full-name"
            label="Full Name"
            name="full name"
            onChange={handleChange("fullName")}
          />
        )}
        <TextField
          InputLabelProps={{ classes: { root: classes.label } }}
          variant="outlined"
          margin="normal"
          value={username}
          required
          fullWidth
          error={isValidUsername}
          helperText={isValidUsername ? "Invalid username format" : ""}
          name="username"
          label="Username"
          id="username"
          onChange={handleChange("username")}
        />
        <TextField
          InputLabelProps={{ classes: { root: classes.label } }}
          variant="outlined"
          margin="normal"
          value={password}
          required
          fullWidth
          error={isValidPassword}
          helperText={isValidPassword ? "Minimum length of 5 characters" : ""}
          name="password"
          label="Password"
          type="password"
          id="password"
          onChange={handleChange("password")}
        />
        {index === 1 && (
          <TextField
            InputLabelProps={{ classes: { root: classes.label } }}
            variant="outlined"
            margin="normal"
            value={confirmPassword}
            required
            fullWidth
            error={isValidConfirmedPassword}
            helperText={isValidConfirmedPassword ? "Passwords don't match" : ""}
            name="confirm password"
            label="Confirm Password"
            type="password"
            id="confirm-password"
            onChange={handleChange("confirmPassword")}
          />
        )}
        {error && <p>{error}</p>}
        <Button
          color="primary"
          type="submit"
          fullWidth
          variant="contained"
          className={classes.submit}
        >
          {index === 1 ? "Register" : "Login"}
        </Button>
      </form>
    </Typography>
  );
};

export default TabPanel;
