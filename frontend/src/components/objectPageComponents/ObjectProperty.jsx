import { Text, Input, Flex } from "@fluentui/react-northstar";
import { Link } from "react-router-dom";

/**
 * The Object Property Grid is composed of a grid of individual Object Property
 * Components. Each Object Property contains a label (title) and a value.
 */

const ObjectProperty = (props) => {
  const handleTextChange = (e) => {
    props.handleTextChange(e, props.propertyKey);
  };

  /*
   * "valueElement" is either plaintext, an input field, or a link depending on
   * whether the property is disabled, editable, and whether it has a link.
   */
  let valueElement = <Text size="large" content={props.propertyValue} />;
  if (props.editable && !props.disabled) {
    valueElement = (
      <Input
        onChange={handleTextChange}
        size="large"
        defaultValue={props.propertyValue}
      />
    );
  } else if (props.disabled && typeof props.link !== "undefined") {
    valueElement = (
      <Link
        style={{ textDecoration: "none" }}
        to={
          "../" +
          props.link.system +
          "/" +
          props.link.interface +
          "/" +
          props.link.businessObject +
          props.link.pageType
        }
      >
        <Text size="large" atMention={true} content={props.propertyValue} />
      </Link>
    );
  }

  return (
    <Flex styles={{ padding: "15px" }} column>
      <Text size="medium" content={props.propertyName} />
      {valueElement}
    </Flex>
  );
};

export default ObjectProperty;
