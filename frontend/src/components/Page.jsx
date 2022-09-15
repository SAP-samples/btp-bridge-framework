import TablePage from "./TablePage";
import ObjectPage from "./ObjectPage";

/**
 * The Page component is a parent component for the two types of currently
 * supported pages: Table Page and Object Page.
 */

const Page = (props) => {
  switch (props.config.pageType) {
    case "Table":
      return (
        <TablePage
          backendUrl={props.backendUrl}
          config={props.config}
          authToken={props.authToken}
        />
      );
    case "Object":
      return (
        <ObjectPage
          backendUrl={props.backendUrl}
          config={props.config}
          authToken={props.authToken}
        />
      );
    default:
      return <h1>There is no page of type {props.config.pageType}.</h1>;
  }
};

export default Page;
