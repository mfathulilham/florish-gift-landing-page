import PropTypes from "prop-types";
import styles from "./Icon.module.scss";

import * as IconCollection from "./assets/build";

const getClass = (icon, size) => {
  const list = ["icon"];
  list[list.length] = `icon--${size}`;
  list[list.length] = icon ? "" : "icon--not-found";

  return list.join(" ");
};

const Icon = ({ type, size, className = "", ...props }) => {
  const Element = IconCollection[type];
  return (
    <span className={`${styles[getClass(type, size)]} ${className}`} {...props}>
      <Element />
    </span>
  );
};

Icon.defaultProps = {
  type: "unknown",
  size: "",
  position: "",
};

Icon.propTypes = {
  type: PropTypes.string,
  size: PropTypes.string,
  position: PropTypes.string,
  className: PropTypes.string,
};

export default Icon;
