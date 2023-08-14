import { useNavigate } from "react-router-dom";
import { useRef, forwardRef } from "react";
import { Typography } from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
/**
 * The Header component automatically appears on all object and table pages. It
 * contains a title and optionally (depending on the viewMoreDetails query
 * parameter) a back button. The back button functions like the back button on a
 * browser, so it will not work on the first page that is opened.
 */

const Header = forwardRef((props, ref) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  };

  const searchParams = useRef(new URLSearchParams(window.location.search));

  /**
   * The query parameter viewMoreDetails will be set to true when the task
   * module is opened by clicking the "View More Details" button on an adaptive
   * card. When this query parameter is true it will prevent the back button
   * from appearing in the task module's header. This will prevent users from
   * unintentionally navigating away from the object they are intending to
   * review.
   **/
  return (
    <>
      <div
        style={{
          height: "77px",
          background: "#FFFFFF",
          border: "1px solid #EEEFF4",
          boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
          position: "sticky",
          top: "0",
          zIndex: 1000,
        }}
      >
        <Toolbar ref={ref} sx={{ justifyContent: "center" }}>
          <Typography variant="h6" component="div">
            {props.title}
          </Typography>
        </Toolbar>
      </div>
    </>
  );
});

export default Header;
