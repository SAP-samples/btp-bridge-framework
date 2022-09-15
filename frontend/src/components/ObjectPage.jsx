import {
  Alert,
  Flex,
  Box,
  FlexItem,
  Text,
  Divider,
} from "@fluentui/react-northstar";
import Header from "./Header";
import Loader from "./Loader";
import { useEffect, useRef, useState, useCallback } from "react";
import * as helper from "./helpers";
import ObjectPropertyGrid from "./objectPageComponents/ObjectPropertyGrid";
import ObjectButtonBar from "./objectPageComponents/ObjectButtonBar";
import ObjectApprovalBar from "./objectPageComponents/ObjectApprovalBar";
import * as microsoftTeams from "@microsoft/teams-js";
import Table from "./Table";

/**
 * The Object Page is a type of page that contains details about one particular
 * instance of a business object from an SAP system (such as S/4HANA). The
 * Object page currently supports two different components: Object Property Grid
 * and Table.
 */

const ObjectPage = (props) => {
  const currentUrl = new URL(window.location.href);
  const searchParams = currentUrl.searchParams;
  /**
   * Dependent objects, such as Purchase Order Item, are defined in the
   * configuration files with a reference to their parent object. In the case of
   * Purchase Order Item, it is defined as "PurchaseOrder/PurchaseOrderItem". In
   * this file, businessObject would refer to "PurchaseOrderItem" instead of
   * "PurchaseOrder/PurchaseOrderItem".
   */
  const businessObject = props.config.businessObject.split("/").pop();
  const objectID = searchParams.get(businessObject);
  const [propertyList, setPropertyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const editable = useRef(false);
  const propertyGrid = useRef(null);
  const editedValues = useRef({});
  const [errorMessage, setErrorMessage] = useState("");

  const paramPathArray = [];
  props.config.businessObject.split("/").forEach((obj) => {
    paramPathArray.push(obj);
    if (searchParams.has(obj)) {
      paramPathArray.push(searchParams.get(obj));
    }
  });

  const req =
    props.backendUrl +
    "/" +
    props.config.system +
    "/" +
    props.config.interface +
    "/" +
    paramPathArray.join("/");

  const updatePropertyListWithValues = useCallback(() => {
    const propertyGridComponent = props.config.components.find(
      (component) => component.type === "PropertyGrid"
    );
    if (propertyGridComponent) {
      const properties = propertyGridComponent.properties;

      helper
        .getData(req, props.authToken)
        .then((data) => {
          const propertyListCopy = JSON.parse(JSON.stringify(properties));
          propertyListCopy.forEach((property) => {
            if (property.editable === true) {
              editable.current = true;
            }
            if (data.hasOwnProperty(property.key)) {
              if (helper.isDate(data[property.key])) {
                property.value = helper.formatDate(
                  JSON.parse(JSON.stringify(data[property.key]))
                );
              } else {
                property.value = JSON.parse(JSON.stringify(data[property.key]));
              }
            }
          });
          setPropertyList(propertyListCopy);
          setLoading(false);
        })
        .catch((error) => {
          console.log("Error:", error);
        });
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    microsoftTeams.initialize();
    updatePropertyListWithValues();
  }, [updatePropertyListWithValues]);

  const scrollToPropertyGrid = () => propertyGrid.current.scrollIntoView();

  const handleTextChange = (e, propertyKey) => {
    editedValues.current[propertyKey] = e.target.value;
    console.log("Edited Values: ", editedValues);
  };

  const handleEditClick = (e) => {
    e.preventDefault();
    scrollToPropertyGrid();
    setEditing(true);
  };

  const handleSaveClick = (e) => {
    e.preventDefault();
    if (Object.keys(editedValues.current).length > 0) {
      setLoading(true);
      helper
        .updateData(req, editedValues.current, props.authToken)
        .then((response) => {
          console.log("Update response", response);
          if (
            response.hasOwnProperty("data") &&
            !(response.status >= 200 && response.status <= 299)
          ) {
            if (response["data"] === "" || response["data"].length === 0) {
              setErrorMessage("An unspecified error has occurred.");
            } else {
              if (typeof response["data"] === "string") {
                // error box will not new line
                setErrorMessage(response["data"].replace("\n", " and "));
              } else {
                setErrorMessage(response["data"].value);
              }
            }
            editedValues.current = {};
            setEditing(true);
          } else {
            setErrorMessage("");
            setEditing(false);
            editedValues.current = {};
          }
          updatePropertyListWithValues();
        })
        .catch((error) => {
          console.log("Error:", error);
        });
    } else {
      setErrorMessage("No changes have been made.");
    }
  };

  const handleCancelClick = (e) => {
    e.preventDefault();
    setErrorMessage("");
    editedValues.current = {};
    setEditing(false);
  };

  const handleExportClick = (e) => {
    e.preventDefault();
    const objData = {};
    propertyList.forEach((property) => {
      objData[property.content] = property.value;
    });
    microsoftTeams.tasks.submitTask({
      title: props.config.title + " #" + objectID,
      objData: objData,
      url: window.location.href,
    });
  };

  const handleApproveClick = (e) => {
    e.preventDefault();
    console.log("Approved the request.");
  };

  const handleRejectClick = (e) => {
    e.preventDefault();
    console.log("Rejected the request.");
  };

  const componentList = [];

  props.config.components.forEach((component) => {
    switch (component.type) {
      case "PropertyGrid":
        componentList.push(
          <ObjectPropertyGrid
            handleTextChange={handleTextChange}
            propertyList={propertyList}
            disabled={!editing}
            refProp={propertyGrid}
          />
        );
        break;
      case "Table":
        componentList.push(
          <Table
            backendUrl={props.backendUrl}
            table={component}
            pageObject={props.config.businessObject}
            config={props.config}
            authToken={props.authToken}
          />
        );
        break;
      default:
        componentList.push(
          <Text content="No component of that type exists." />
        );
        break;
    }
    componentList.push(<Divider />);
  });

  componentList.pop();

  // Creating and obtaining the header reference to get loading margin value
  const ref = useRef(null);
  const [marginHeight, setMarginHeight] = useState(0);
  useEffect(() => {
    ref.current?.focus();
    setMarginHeight(ref.current.clientHeight);
  }, []);

  return (
    <Flex column styles={{ minHeight: "100vh" }}>
      <Header title={props.config.title + " #" + objectID} ref={ref} />
      {loading ? (
        <Loader headerHeight={marginHeight} />
      ) : (
        <>
          {errorMessage !== "" && <Alert danger content={errorMessage} />}
          {componentList}
          <FlexItem grow>
            <Box />
          </FlexItem>
          {props.config.approval ? (
            <ObjectApprovalBar
              handleApproveClick={handleApproveClick}
              handleRejectClick={handleRejectClick}
            />
          ) : (
            <ObjectButtonBar
              editing={editing}
              editable={editable.current}
              handleEditClick={handleEditClick}
              handleSaveClick={handleSaveClick}
              handleCancelClick={handleCancelClick}
              handleExportClick={handleExportClick}
            />
          )}
        </>
      )}
    </Flex>
  );
};

export default ObjectPage;
