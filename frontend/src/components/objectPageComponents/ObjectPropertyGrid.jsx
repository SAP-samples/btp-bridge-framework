import { Box, Grid } from "@fluentui/react-northstar";
import ObjectProperty from "./ObjectProperty";

/**
 * The Object Property Grid only appears on object pages. It displays the labels
 * (titles) and values of the properties specified in the object page's
 * configuration file.
 */

const ObjectPropertyGrid = (props) => {
  const objectPropertyList = [];
  props.propertyList.forEach((property) => {
    const objectProperty = (
      <ObjectProperty
        propertyName={property.content}
        propertyValue={property.value}
        disabled={props.disabled}
        propertyKey={property.key}
        key={property.key}
        editable={property.editable ? property.editable : false}
        link={property.link}
        handleTextChange={props.handleTextChange}
      />
    );
    objectPropertyList.push(objectProperty);
  });

  const gridStyles = {
    gridTemplateColumns: `repeat(auto-fit,minmax(max(250px,${
      (1 / 3) * 100
    }%), 1fr))`,
    padding: "30px",
  };

  return (
    <Box styles={{ align: "center" }}>
      {/**
       * A div must be used as a container for the property grid
       * in order to be a target for scrolling upon an edit click
       */}
      <div ref={props.refProp}>
        <Grid styles={gridStyles} content={objectPropertyList} />
      </div>
    </Box>
  );
};

export default ObjectPropertyGrid;
