const React = require('react');

exports.Link = ({ children }) => React.createElement('span', null, children);
exports.Stack = ({ children }) => React.createElement('div', null, children);
exports.useLocalSearchParams = () => ({});
exports.useRouter = () => ({ push: () => {} });
