import {
  Table as MSTable,
  Box,
  Text,
  Input,
  SearchIcon,
  gridNestedBehavior,
  Header,
  Loader as MSLoader,
} from "@fluentui/react-northstar";
import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import * as helper from "./helpers";
import Loader from "./Loader";

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
  const maxItems = useRef(50);
  const searchable = useRef(false);
  const navigate = useNavigate();
  const req = useRef("");

  const currentUrl = new URL(window.location.href);
  const searchParams = currentUrl.searchParams;

  const populateTable = useCallback(
    (url) => {
      setLoading(true);
      helper
        .getData(url, props.authToken)
        .then((data) => {
          const tableDatas = helper.formatTableData(
            data,
            props.table.columns,
            businessObject.current
          );
          if (interactive.current) {
            tableDatas.forEach((item, i) => {
              let tableLinkParams = new URL(window.location.href).searchParams;
              tableDatas[i].onClick = () => {
                tableLinkParams.set(
                  businessObject.current,
                  tableDatas[i].searchparam
                );
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
                    tableLinkParams.toString()
                );
              };
            });
          }
          setFormattedData(tableDatas);
          setLoading(false);
        })
        .catch((error) => {
          console.log("Error: ", error);
        });
    },
    [navigate]
  );

  useEffect(() => {
    if (originalData.length === 0) {
      setOriginalData(formattedData);
    }
  }, [formattedData]);

  useEffect(() => {
    interactive.current = props.table.hasOwnProperty("interactive")
      ? props.table.interactive
      : false;

    maxItems.current = props.table.hasOwnProperty("maxItems")
      ? props.table.maxItems
      : 50;

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

    req.current =
      props.backendUrl +
      "/" +
      props.table.system +
      "/" +
      props.table.interface +
      "/" +
      paramPathArray.join("/") +
      "?top=" +
      maxItems.current +
      "&filterValue=";

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
      populateTable(req.current + query);
    }
  };

  const centering = (index) => {
    return props.table.columns[index].align;
  };

  return (
    <Box styles={{ padding: "30px" }}>
      {props.table.title && (
        <Header
          styles={{ paddingLeft: "10px" }}
          as="h3"
          content={props.table.title}
        />
      )}
      {props.table.searchable && (
        <Box styles={{ paddingBottom: "15px" }}>
          <Input
            fluid
            placeholder={"Search..."}
            onChange={handleTextChange}
            clearable
            onKeyUp={handleSearch}
            icon={<SearchIcon />}
          />
        </Box>
      )}
      <MSTable
        style={{ paddingBottom: "10px" }}
        aria-label="Nested nagivation"
        accessibility={gridNestedBehavior}
      >
        <MSTable.Row header>
          {props.table.columns.map((item) => (
            <MSTable.Cell
              content={item.content}
              style={{ fontSize: "0.875rem", fontWeight: "600" }}
            />
          ))}
        </MSTable.Row>
        {formattedData.map((row) => (
          <MSTable.Row onClick={() => row.onClick()}>
            {row.items.map((item, index) => (
              <MSTable.Cell
                content={item.content}
                style={{ justifyContent: centering(index) }}
              />
            ))}
          </MSTable.Row>
        ))}
      </MSTable>
      {formattedData.length === 0 && !loading && (
        <Text
          styles={{ padding: "10px" }}
          size="medium"
          content="No items found."
        />
      )}
      {formattedData.length > 0 && !loading && searchable.current && (
        <Text
          styles={{ padding: "10px" }}
          size="medium"
          content={
            formattedData.length + " item(s) displayed, search to view more..."
          }
        />
      )}
      
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
  );
};

export default Table;
