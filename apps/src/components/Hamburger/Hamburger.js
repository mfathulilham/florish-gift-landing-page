import style from "./Hamburger.module.scss";
import PropTypes from "prop-types";

const Hamburger = ({ checked, onClick }) => {
  return (
    <label className={style.burger} htmlFor="burger" aria-label="burger">
      <input
        type="checkbox"
        id="burger"
        className={style.hidden}
        checked={checked}
        onChange={(evt) => onClick(evt)}
      />
      <span />
    </label>
  );
};

Hamburger.propTypes = {
  checked: PropTypes.boolean,
  onClick: PropTypes.func,
};

export default Hamburger;
