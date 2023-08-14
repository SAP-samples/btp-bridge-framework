import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import * as React from "react";

import Header from "./Header";

import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";

/**
 * Opening the Bridge Framework app from the messaging extension toolbar will
 * always load the landing page first. The landing page contains cards that link
 * to table pages for business objects. The format for the routes to the table
 * pages must always follow as such: "/System/Interface/TablePage". A specific
 * example could be: "/S4HanaCloud/Destination/PurchaseOrderTable".
 */

const LandingPage = (props) => {
  const [formattedData, setFormattedData] = useState([]);
  const ref = useRef(null);
  const [marginHeight, setMarginHeight] = useState(0);
  useEffect(() => {
    ref.current?.focus();
    setMarginHeight(ref.current.clientHeight);
  }, []);

  const formatData = (data) => {
    let formattedDataArr = [];
    for (let item of data.solutions) {
      formattedDataArr.push(
        <Grid item xs={12}>
          <Item>
            <React.Fragment>
              <Link key={0} style={{ textDecoration: "none" }} to={item.path}>
                <Typography
                  sx={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "#34a8eb",
                  }}
                  gutterBottom
                >
                  {item.header}
                </Typography>
                <Typography variant="body2" color="textPrimary">
                  {item.description}
                </Typography>
              </Link>
            </React.Fragment>
          </Item>
        </Grid>
      );
    }
    return formattedDataArr;
  };

  useEffect(() => {
    setFormattedData(formatData(props.pageConfig));
  }, [props.pageConfig]);

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  return (
    <div>
      <Header title="Home" ref={ref} />
      <br />
      <Container maxWidth="sm">
        <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          {formattedData}
        </Grid>
      </Container>
    </div>
  );
};

export default LandingPage;
