import { Box, Button, Flex, Segment } from "@fluentui/react-northstar";

/**
 * Currently unused, but intended for approval flow scenarios. Can be shown on
 * an object page if the "approval" property in the page's configuration is set
 * to "true".
 */

const ObjectApprovalBar = (props) => {
  return (
    <Box
      styles={{
        position: "sticky",
        bottom: "0",
        height: "fit-content",
        boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.25)",
      }}
    >
      <Segment styles={{ width: "100%" }}>
        <Flex gap="gap.small" hAlign="end">
          <Flex
            styles={{
              paddingRight: "16px",
            }}
            gap="gap.small"
          >
            <Button
              onClick={props.handleApproveClick}
              disabled={props.editing}
              primary
              content="Approve"
            />
            <Button onClick={props.handleRejectClick} text content="Reject" />
          </Flex>
        </Flex>
      </Segment>
    </Box>
  );
};

export default ObjectApprovalBar;
