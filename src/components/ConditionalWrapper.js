import PropTypes from 'prop-types';

const ConditionalWrapper = ({ condition, wrapper, children }) => (condition ? wrapper(children) : children);

ConditionalWrapper.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  condition: PropTypes.bool.isRequired,
  wrapper: PropTypes.func.isRequired,
};

export default ConditionalWrapper;
