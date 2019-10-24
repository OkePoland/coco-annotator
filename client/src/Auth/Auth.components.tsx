import { makeStyles, Theme } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme: Theme) => ({
  form: {
    width: "100%",
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  container: {
    display: "flex",
    flexDirection: "row",
    padding: 55
  },
  tab: {
    color: "#000",
    "&:hover": {
      color: "#007bff"
    }
  },
  label: {
    backgroundColor: "#FFF"
  }
}));
