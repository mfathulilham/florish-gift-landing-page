import PropTypes from "prop-types";

const Image = ({ className, src, fallback, alt, ...props }) => {
  function onImageError(e) {
    const image = e.target;
    const parent = image.parentNode;
    parent.children[0].srcset = parent.children[1].srcset = image?.src;
  }

  return (
    <picture className={className}>
      <source srcSet={src} type="image/webp" />
      <source srcSet={fallback} type="image/jpeg" />
      <img
        src={fallback}
        alt={alt}
        onError={(e) => onImageError(e)}
        {...props}
      />
    </picture>
  );
};

Image.propTypes = {
  className: PropTypes.string,
  src: PropTypes.string.isRequired,
  fallback: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
};

export default Image;
