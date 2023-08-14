import { Box, Loader as MSLoader } from "@fluentui/react-northstar";
import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import * as helper from "../helpers";
import Loader from "./Loader";

import { Table as gTable } from "@mui/material/Table";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
/**
 * The Table component can appear either as the singular component on both a
 * table page and an object page, or alongside other components on an object
 * page. The table component can have a title, can have clickable (interactive)
 * rows, can display a specified max number of rows, and can include a searchbar
 * if properly configured.
 */

const Table = (props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [formattedData, setFormattedData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const businessObject = useRef(props.table.businessObject.split("/").pop());
  const interactive = useRef(false);
  const searchable = useRef(false);
  const navigate = useNavigate();
  const req = useRef("");
  const pathParamsRef = useRef([]);
  const [googleData, setGoogleData] = useState([]);

  // Google

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [gTableColumns, setGtableColumns] = useState([]);

  //   Data
  const [rows, setRows] = useState([]);

  const currentUrl = new URL(window.location.href);
  const searchParams = currentUrl.searchParams;

  const populateTable = useCallback(
    (url) => {
      setLoading(false);
      helper
        .getData(url, props.authToken, null, null)
        .then((data) => {
          const tableDatas = helper.formatGoogleData(
            data,
            props.table.columns,
            businessObject.current
          );
          setGoogleData(tableDatas);
          setLoading(false);
        })
        .catch((error) => {
          console.log("Error: ", error);
        });
    },
    [navigate]
  );

  const setColumnDetails = (columns) => {
    console.log("setcolumn", columns);
    const col = [];
    for (let c of columns) {
      col.push({ id: c.key, label: c.content, minWidth: 170 });
    }
    setGtableColumns(col);
  };

  useEffect(() => {
    setColumnDetails(props.table.columns);
    if (originalData.length === 0) {
      setOriginalData(formattedData);
    }
    console.log(formattedData);
  }, [formattedData]);

  useEffect(() => {
    interactive.current = props.table.hasOwnProperty("interactive")
      ? props.table.interactive
      : false;

    searchable.current = props.table.hasOwnProperty("searchable")
      ? props.table.searchable
      : false;

    const paramPathArray = [];
    props.table.businessObject.split("/").forEach((obj) => {
      paramPathArray.push(obj);
      if (searchParams.has(obj)) {
        paramPathArray.push(searchParams.get(obj));
      }
    });

    // Store [index, pathParamName] pair in case of multiple path params need for API call
    let index = 0;
    let paramIndexPairs = [];
    if (props.table.hasOwnProperty("keys") && props.table.keys.length > 0) {
      props.table.columns.forEach((column) => {
        if (props.table.keys.includes(column.key)) {
          let paramIndexPair = [];
          paramIndexPair.push(index++);
          paramIndexPair.push(column.key);
          paramIndexPairs.push(paramIndexPair);
        }
      });
      pathParamsRef.current = paramIndexPairs;
    }

    req.current =
      props.backendUrl +
      "/" +
      props.table.system +
      "/" +
      props.table.interface +
      "/" +
      paramPathArray.join("/");

    if (
      process.env.hasOwnProperty("REACT_APP_SCROLL_PAGE_SIZE") &&
      process.env.REACT_APP_SCROLL_PAGE_SIZE > 0
    ) {
      req.current += "?&top=" + process.env.REACT_APP_SCROLL_PAGE_SIZE;
    }

    populateTable(req.current);
  }, [populateTable]);

  const handleTextChange = (e) => {
    e.preventDefault();
    const value = e.target.value ? e.target.value : "";
    console.log("Search query: ", searchQuery);
    setSearchQuery(value);
    // Get all the data on clicking (X) button on the searchbox
    if (typeof e.target.value === "undefined") {
      // Getting data based on empty string
      populateTable(req.current);
    }

    if (value.length === 0) {
      setFormattedData(originalData);
    }
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      console.log("Searching...");
      e.preventDefault();
      const p = searchQuery ? searchQuery : "";
      const query = p;
      // if search has been triggered before
      if (req.current.indexOf("&filter=") > -1) {
        let start = req.current.indexOf("&filter=") + "&filter=".length;
        let end = start;
        while (!isNaN(req.current[end])) {
          end++;
        }
        req.current =
          req.current.substring(0, start) +
          query +
          req.current.substring(end, req.current.length);
      } else if (req.current.indexOf("&top=") <= -1) {
        req.current += "?&filter=" + query;
      } else {
        req.current += "&filter=" + query;
      }
      populateTable(req.current);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  function handleRowClick(id) {
    console.log(`Clicked row with code ${id}`);
    let tableLinkParams = new URL(window.location.href).searchParams;

    tableLinkParams.set(businessObject.current, id);

    /* Send [[pathParamName, value]] key-value pairs along with navigate
     * in-case of original system api needs multiple path parameters
     */
    let kvPairs = [];

    /**
     * "Object" is added after the businessObject because all paths
     * to an object page end in "Object", for example:
     * "/PurchaseOrderObject" or "/SalesOrderObject"
     */
    navigate(
      "../" +
        props.table.system +
        "/" +
        props.table.interface +
        "/" +
        businessObject.current +
        "Object?" +
        tableLinkParams.toString(),
      { state: { kvPairs: kvPairs } }
    );
  }

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <>
      <Box styles={{ padding: "30px" }}>
        {/**
         * The loading behavior is different on object pages vs on table pages.
         * On a table page the loader will occupy the entire task module, whereas on
         * an object page the loader will be localized to the table.
         */}
        {loading && !props.pageObject && (
          <Loader headerHeight={props.headerHeight} />
        )}
        {loading && props.pageObject && <MSLoader size="small" />}
      </Box>

      <Container maxWidth="md">
        <br />
        {props.table.title && (
          <Typography variant="h6" gutterBottom>
            {props.table.title}
          </Typography>
        )}
        <br />
        {props.table.searchable && (
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item xs={6}>
              <Button variant="text" onClick={handleBackClick}>
                {"< Back"}
              </Button>
            </Grid>
            <Grid
              item
              xs={6}
              sx={{ display: "flex", justifyContent: "flex-end" }}
            >
              <TextField
                id="outlined-basic"
                label="Search"
                variant="outlined"
                onChange={handleTextChange}
                onKeyUp={handleSearch}
                sx={{
                  width: "100%",
                  maxWidth: "400px",
                  backgroundColor: "white",
                }}
              />
            </Grid>
          </Grid>
        )}
        <br />
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <gTable stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {gTableColumns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {googleData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row[businessObject.current]}
                        onClick={() =>
                          handleRowClick(row[businessObject.current])
                        }
                      >
                        {gTableColumns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.format && typeof value === "number"
                                ? column.format(value)
                                : value}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </gTable>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Container>
    </>
  );
};

export default Table;
